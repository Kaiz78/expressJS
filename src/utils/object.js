/**
 * Fonction pour convertir les BigInt en String lors de la conversion en JSON
 * @param {Object} data - Objet à convertir
 * @returns {Object} - Objet converti
 */
function toObject(data) {
  console.log(data);

  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' || typeof value === 'datetime'
        ? value.toString()
        : value 
));
};


/**
 * Fonction Génération de 50 caractères aléatoires
  * @returns {String} - Chaine de caractères aléatoires
 */
function generateToken() {
  return [...Array(50)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
}

  export default { toObject,generateToken };
