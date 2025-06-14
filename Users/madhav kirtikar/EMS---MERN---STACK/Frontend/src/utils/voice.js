export function speak(text, lang = "en") {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
}


export function listen(lang = "en", callback) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (e) => callback(e.results[0][0].transcript);
  recognition.onerror = () => callback("");
  recognition.start();
}