let storednames = [] // from sheet
let current = [...document.querySelectorAll('.productName')].map(e=>[e.textContent,e.parentNode.querySelector('img').src])
let currentnames = currentpix.map(e=>e[0])
let newnames = currentnames.filter(e=>!storednames.some(f=>f===e))
let discontnames = storednames.filter(e=>!currentnames.some(f=>f===e))
