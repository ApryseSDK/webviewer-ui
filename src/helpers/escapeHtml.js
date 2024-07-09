const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

// to prevent XSS to some extent
// https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
// for example:
// <img src="asdf" onerror=alert(document.cookie)> -> &lt;img src&#x3D;&quot;asdf&quot; onerror&#x3D;alert(document.cookie)&gt;
export default (string) => String(string).replace(/[&<>"'`=\/]/g, function(s) {
  return entityMap[s];
});
