class HttpClient {
    constructor() {
      this.baseUrl = 'http://localhost:8080';
    }

    async get(endpoint) {
        const url = `${this.baseUrl}/api/mineracao/${endpoint}`;
        
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Erro na requisição');
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Erro:', error);
          throw error;
        }
      }
}

const httpClientInstance = new httpClient();
