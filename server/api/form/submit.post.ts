export default defineEventHandler((event) => {
  // const data = {
  //   "ok": false,
  //   "message": "Bitte korrigieren Sie die markierten Felder.",
  //   "fieldErrors": {
  //     "email": "Die E-Mail-Adresse ist ungültig.",
  //     "message": "Bitte geben Sie eine Nachricht an."
  //   }
  // }  

  const data = { "ok": true, "message": "Wir haben Ihre Anfrage erhalten und melden uns zeitnah." };

  return data;
});