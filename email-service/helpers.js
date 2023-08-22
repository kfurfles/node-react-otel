/**
 * Analisa uma mensagem e retorna um objeto com informações relevantes.
 * @param {Object} message - A mensagem a ser analisada.
 * @returns {Object} O objeto com informações analisadas da mensagem.
 */
function parseMessage(message) {
  return {
    key: message.key ? message.key.toString() : null,
    value: message.value ? message.value.toString() : null,
    partition: message.partition || null,
    headers: message.headers
      ? Object.entries(message.headers).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: value.toString(),
          };
        }, {})
      : {},
    timestamp: message.timestamp || null,
  };
}

module.exports = {
    parseMessage 
}