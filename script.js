// Inicijuojame CodeMirror redaktorių su tamsia tema
editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  mode: 'python', theme: 'dracula', lineNumbers: true
});
let currentFileIndex = 0;

// Pakraunant failą nustatome currentFileIndex
function loadFile(index) {
  currentFileIndex = index;
  editor.setValue(files[index].code);
}

// Išsaugome pakeitimus į atitinkamą failą
editor.on("change", () => {
  files[currentFileIndex].code = editor.getValue();
});

// Vykdome Python kodą su Pyodide
runBtn.onclick = async () => {
  results.textContent = '';
  try {
    const code = editor.getValue();
    let result = await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
try:
    exec(\`${code}\`)
    result = sys.stdout.getvalue()
finally:
    sys.stdout = sys.__stdout__
result
    `);
    results.textContent = result;
  } catch (err) {
    results.textContent = 'Klaida: ' + err;
  }
};
