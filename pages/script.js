const darkMode = document.getElementById('darkMode');
const isDark = localStorage.getItem('darkMode') !== 'false';

darkMode.checked = isDark;
if (!isDark) document.body.classList.add('light');

darkMode.addEventListener('change', () => {
  localStorage.setItem('darkMode', darkMode.checked);
  darkMode.checked ? document.body.classList.remove('light') : document.body.classList.add('light');
});
