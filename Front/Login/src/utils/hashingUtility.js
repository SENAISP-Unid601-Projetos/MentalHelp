const hashingUtility = {
    async generateSecureHash(login,password){
        const encoder = new TextEncoder();
        const transformData = `${login}+${password}`
        const dataBuffer = encoder.encode(transformData);

        //gerar a hash SHA-256
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

        //Converte a hash para uma string hexadecimal
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        //Varre byte a byte e garante que cada byte venha acompanhado de 2 numeros
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2,'0')).join('');

        return hashHex;
    }
};

export default hashingUtility