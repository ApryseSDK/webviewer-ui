import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';

const OutlineUtils = {
  setDoc(doc, documentViewerKey = 1) {
    if (!this.doc) {
      this.doc = {};
    }
    this.doc = {
      ...this.doc,
      [documentViewerKey]: doc,
    };
  },
  getDoc(documentViewerKey = 1) {
    return this.doc?.[documentViewerKey];
  },
  async setOutlineName(path, newName, documentViewerKey = 1) {
    const target = await this.findPDFNetOutline(path, documentViewerKey);

    if (!target) {
      return;
    }

    await target.setTitle(newName);
    const bookmarkEventObject = {
      ...target,
      bookmark: target,
      path,
      action: 'setOutlineName'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return path;
  },
  async setOutlineDestination(path, pageNum, x, y, zoom, documentViewerKey = 1) {
    const target = await this.findPDFNetOutline(path, documentViewerKey);

    if (!target) {
      return;
    }

    const PDFNet = window.Core.PDFNet;
    const doc = await this.getDoc(documentViewerKey)?.getPDFDoc();
    if (!doc) {
      return;
    }
    return PDFNet.runWithCleanup(async () => {
      const page = await doc.getPage(pageNum);
      const destination = await PDFNet.Destination.createXYZ(page, x, y, zoom);
      target.setAction(await PDFNet.Action.createGoto(destination));
      const bookmarkEventObject = {
        ...target,
        bookmark: target,
        path,
        action: 'setOutlineDestination'
      };
      fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    });
  },
  async addRootOutline(newName, pageNum, x, y, zoom, documentViewerKey = 1) {
    const newOutline = await this.createOutlineXYZ(newName, pageNum, x, y, zoom, documentViewerKey);
    const doc = await this.getDoc(documentViewerKey)?.getPDFDoc();
    if (!doc) {
      return;
    }

    await doc.addRootBookmark(newOutline);

    const bookmarkEventObject = {
      ...newOutline,
      bookmark: newOutline,
      path: '0',
      action: 'addRootOutline'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return '0';
  },
  async addNewOutline(newName, path, pageNum, x, y, zoom, documentViewerKey = 1) {
    let target;

    const hasActiveOutline = !!path;
    if (hasActiveOutline) {
      target = await this.findPDFNetOutline(path, documentViewerKey);
    } else {
      target = await this.getLastOutline(documentViewerKey);
    }

    if (!target) {
      return null;
    }

    const newOutline = await this.createOutlineXYZ(newName, pageNum, x, y, zoom, documentViewerKey);
    if (hasActiveOutline) {
      await target.addChild(newOutline);
    } else {
      await target.addNext(newOutline);
    }

    const addedOutlinePath = await this.findPathInTree(newOutline, documentViewerKey);
    const bookmarkEventObject = {
      ...newOutline,
      bookmark: newOutline,
      path: addedOutlinePath,
      action: 'addNewOutline'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return addedOutlinePath;
  },
  async createOutlineXYZ(newName, pageNum, x, y, zoom, documentViewerKey = 1) {
    const PDFNet = window.Core.PDFNet;
    const doc = await this.getDoc(documentViewerKey)?.getPDFDoc();
    if (!doc) {
      return;
    }
    return PDFNet.runWithCleanup(async () => {
      const newOutline = await PDFNet.Bookmark.create(doc, newName);

      const page = await doc.getPage(pageNum);
      const dest = await PDFNet.Destination.createXYZ(page, x, y, zoom);
      newOutline.setAction(await PDFNet.Action.createGoto(dest));

      return newOutline;
    });
  },
  async deleteOutline(path, documentViewerKey = 1) {
    const target = await this.findPDFNetOutline(path, documentViewerKey);

    if (!target) {
      return;
    }

    if (target) {
      const bookmarkEventObject = {
        ...target,
        bookmark: target,
        path,
        action: 'deleteOutline'
      };
      await target.delete();
      fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    }

    return null;
  },
  async moveOutlineUp(path, documentViewerKey = 1) {
    const target = await this.findPDFNetOutline(path, documentViewerKey);

    if (!target) {
      return;
    }

    const prev = await target.getPrev();
    if (!(await this.isValid(prev))) {
      return path;
    }

    const copy = await target.copy();
    await target.delete();
    await prev.addPrev(copy);
    const changedOutlinePath = await this.findPathInTree(copy, documentViewerKey);
    const bookmarkEventObject = {
      ...copy,
      bookmark: copy,
      path: changedOutlinePath,
      action: 'moveOutlineUp'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return this.findPathInTree(copy, documentViewerKey);
  },
  async moveOutlineDown(path, documentViewerKey = 1) {
    const target = await this.findPDFNetOutline(path, documentViewerKey);

    if (!target) {
      return path;
    }

    const next = await target.getNext();
    if (!(await this.isValid(next))) {
      return path;
    }

    const copy = await target.copy();
    await target.delete();
    await next.addNext(copy);

    const changedOutlinePath = await this.findPathInTree(copy, documentViewerKey);
    const bookmarkEventObject = {
      ...copy,
      bookmark: copy,
      path: changedOutlinePath,
      action: 'moveOutlineDown'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return this.findPathInTree(copy, documentViewerKey);
  },
  async moveOutlineBeforeTarget(path, targetPath, documentViewerKey = 1) {
    const currTarget = await this.findPDFNetOutline(path, documentViewerKey);
    const target = await this.findPDFNetOutline(targetPath, documentViewerKey);
    if (!target || !currTarget) {
      return path;
    }
    const copy = await currTarget.copy();
    await currTarget.delete();
    await target.addPrev(copy);

    const changedOutlinePath = await this.findPathInTree(copy, documentViewerKey);
    const bookmarkEventObject = {
      ...copy,
      bookmark: copy,
      path: changedOutlinePath,
      action: 'moveOutlineBeforeTarget'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return this.findPathInTree(copy, documentViewerKey);
  },
  async moveOutlineAfterTarget(path, targetPath, documentViewerKey = 1) {
    const currTarget = await this.findPDFNetOutline(path, documentViewerKey);
    const target = await this.findPDFNetOutline(targetPath, documentViewerKey);
    if (!target || !currTarget) {
      return path;
    }
    const copy = await currTarget.copy();
    await currTarget.delete();
    await target.addNext(copy);

    const changedOutlinePath = await this.findPathInTree(copy, documentViewerKey);
    const bookmarkEventObject = {
      ...copy,
      bookmark: copy,
      path: changedOutlinePath,
      action: 'moveOutlineAfterTarget'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return this.findPathInTree(copy, documentViewerKey);
  },
  async moveOutlineOutward(path, documentViewerKey = 1) {
    const target = await this.findPDFNetOutline(path, documentViewerKey);

    if (!target || (await target.getIndent()) === 1) {
      return path;
    }

    const parent = await target.getParent();
    const copy = await target.copy();
    await target.delete();

    await parent.addNext(copy);

    const changedOutlinePath = await this.findPathInTree(copy, documentViewerKey);
    const bookmarkEventObject = {
      ...copy,
      bookmark: copy,
      path: changedOutlinePath,
      action: 'moveOutlineOutward'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return this.findPathInTree(copy, documentViewerKey);
  },
  async moveOutlineOutwardBeforeParent(path, documentViewerKey = 1) {
    const target = await this.findPDFNetOutline(path, documentViewerKey);

    if (!target || (await target.getIndent()) === 1) {
      return path;
    }

    const parent = await target.getParent();
    const copy = await target.copy();
    await target.delete();

    await parent.addPrev(copy);

    const changedOutlinePath = await this.findPathInTree(copy, documentViewerKey);
    const bookmarkEventObject = {
      ...copy,
      bookmark: copy,
      path: changedOutlinePath,
      action: 'moveOutlineOutwardBeforeParent'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return this.findPathInTree(copy, documentViewerKey);
  },
  async moveOutlineOutwardBeforeAncestor(path, ancestorPath, documentViewerKey = 1) {
    const target = await this.findPDFNetOutline(path, documentViewerKey);
    const ancestorTarget = await this.findPDFNetOutline(ancestorPath, documentViewerKey);

    if (!target || (await target.getIndent()) === 1 || !ancestorTarget) {
      return path;
    }

    const copy = await target.copy();
    await target.delete();

    await ancestorTarget.addPrev(copy);

    const changedOutlinePath = await this.findPathInTree(copy, documentViewerKey);
    const bookmarkEventObject = {
      ...copy,
      bookmark: copy,
      path: changedOutlinePath,
      action: 'moveOutlineOutwardBeforeAncestor'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return this.findPathInTree(copy, documentViewerKey);
  },
  async moveOutlineInTarget(path, targetPath, documentViewerKey = 1) {
    const target = await this.findPDFNetOutline(path, documentViewerKey);
    const targetOutline = await this.findPDFNetOutline(targetPath, documentViewerKey);
    if (!target || !targetOutline) {
      return path;
    }

    if (!(await this.isValid(targetOutline))) {
      return path;
    }

    const copy = await target.copy();
    await target.delete();

    if (await targetOutline.hasChildren()) {
      const lastChild = await targetOutline.getLastChild();
      await lastChild.addNext(copy);
    } else {
      await targetOutline.addChild(copy);
    }

    const changedOutlinePath = await this.findPathInTree(copy, documentViewerKey);
    const bookmarkEventObject = {
      ...copy,
      bookmark: copy,
      path: changedOutlinePath,
      action: 'moveOutlineInTarget'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return this.findPathInTree(copy, documentViewerKey);
  },
  async moveOutlineInward(path, documentViewerKey = 1) {
    const target = await this.findPDFNetOutline(path, documentViewerKey);

    if (!target) {
      return path;
    }

    const prev = await target.getPrev();
    if (!(await this.isValid(prev))) {
      return path;
    }

    const copy = await target.copy();
    await target.delete();

    if (await prev.hasChildren()) {
      const lastChild = await prev.getLastChild();
      await lastChild.addNext(copy);
    } else {
      await prev.addChild(copy);
    }

    const changedOutlinePath = await this.findPathInTree(copy, documentViewerKey);
    const bookmarkEventObject = {
      ...copy,
      bookmark: copy,
      path: changedOutlinePath,
      action: 'moveOutlineInward'
    };
    fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkEventObject);
    return this.findPathInTree(copy, documentViewerKey);
  },
  async getCanMoveState(path, documentViewerKey = 1) {
    const state = { up: false, down: false, outward: false, inward: false };
    const target = await this.findPDFNetOutline(path, documentViewerKey);

    if (!target) {
      return state;
    }

    const prev = await target.getPrev();
    if (await this.isValid(prev)) {
      state.up = true;
      state.inward = true;
    }

    const next = await target.getNext();
    if (await this.isValid(next)) {
      state.down = true;
    }

    const parent = await target.getParent();
    if ((await this.isValid(parent)) && (await target.getIndent()) > 1) {
      state.outward = true;
    }

    return state;
  },
  getOutlineId(outline) {
    const name = outline.getName();
    const path = this.getPath(outline);

    return `${path}${this.getSplitter()}${name}`;
  },
  async getLastOutline(documentViewerKey = 1) {
    const doc = await this.getDoc(documentViewerKey)?.getPDFDoc();
    if (!doc) {
      return;
    }
    return window.Core.PDFNet.runWithCleanup(async () => {
      const root = await doc.getFirstBookmark();

      let curr = root;
      while ((await this.isValid(curr)) && (await this.isValid(await curr.getNext()))) {
        curr = await curr.getNext();
      }

      return (await this.isValid(curr)) ? curr : null;
    });
  },
  async findPathInTree(target, documentViewerKey = 1) {
    const doc = await this.getDoc(documentViewerKey)?.getPDFDoc();
    if (!doc) {
      return;
    }
    const root = await doc.getFirstBookmark();
    const queue = [];

    // add all the bookmarks in the first level to the queue
    // this includes the root bookmark and all of its siblings
    let i = 0;
    let curr = root;
    while (await this.isValid(curr)) {
      queue.push([curr, `${i}`]);
      curr = await curr.getNext();
      i++;
    }

    // start a BFS to find the target
    while (queue.length > 0) {
      const node = queue.shift();
      const [outline, path] = node;

      if (outline.id === target.id) {
        return path;
      }

      if (!(await outline.hasChildren())) {
        continue;
      }

      let childIdx = 0;
      let child = await outline.getFirstChild();
      while (await this.isValid(child)) {
        queue.push([child, `${path}${this.getSplitter()}${childIdx}`]);

        child = await child.getNext();
        childIdx++;
      }
    }

    return null;
  },
  async findPDFNetOutline(path, documentViewerKey = 1) {
    if (!path) {
      return Promise.resolve(null);
    }

    const paths = path.split(this.getSplitter());
    const doc = await this.getDoc(documentViewerKey)?.getPDFDoc();
    if (!doc) {
      return;
    }
    return window.Core.PDFNet.runWithCleanup(async () => {
      const rootOutline = await doc.getFirstBookmark();

      let curr = rootOutline;
      for (let level = 0; level < paths.length; level++) {
        for (let i = 0; i < paths[level]; i++) {
          if (!curr) {
            return null;
          }
          curr = await curr.getNext();
        }

        if (level !== paths.length - 1) {
          curr = await curr.getFirstChild();
        }
      }

      if (await this.isValid(curr)) {
        return curr;
      }

      return (await this.isValid(curr)) ? curr : null;
    });
  },
  isAncestor(outline, targetOutline) {
    if (outline === targetOutline) {
      return false;
    }
    let parentOutline = outline.parent;
    while (parentOutline) {
      if (parentOutline === targetOutline) {
        return true;
      }
      parentOutline = parentOutline.parent;
    }
    return false;
  },
  getPathArray(outline) {
    const paths = [];

    let curr = outline;
    while (curr) {
      paths.push(curr.getIndex());
      curr = curr.getParent();
    }

    return paths;
  },
  getPath(outline) {
    return this.getPathArray(outline).reverse().join(this.getSplitter());
  },
  getNestedLevel(outline) {
    return this.getPathArray(outline).length - 1;
  },
  getSplitter() {
    return '-';
  },
  async isValid(pdfnetOutline) {
    // eslint-disable-next-line no-return-await
    return pdfnetOutline && (await pdfnetOutline.isValid());
  },
};

export default Object.create(OutlineUtils);
