class HttpClient {
    constructor() {
      this.baseUrl = `http://localhost:8080`;
    }

    async get(endpoint) {
        const url = `${this.baseUrl}/api/mineracao/${endpoint}`;
        
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Erro na requisição`);
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Erro:`, error);
          throw error;
        }
    }
}
let map;
function retornarLeads(idLead) {
    return new Promise((resolve, reject) => {
        const httpClientInstance = new HttpClient();
        httpClientInstance.get(`get/leads/by-id?id=${idLead}`).then((response) => {
            if (response) {
                sessionStorage.setItem(`leads`, JSON.stringify(response));
                resolve(response); 
            } else {
                reject(new Error(`Nenhum lead encontrado`)); 
            }
        }).catch((error) => {
            reject(error); 
        });
    });
}
async function initMap() { 
    
    retornarLeads(103).then( (response) => {
        let i = 0
        let leads = response.content
        leads.forEach((lead)=> {
            
            positions.push({lat: +lead.latitude, lng: +lead.longitude})
            leadsNames.push(lead.name)
            leadsAdress.push(lead.place)
            leadsCattegory.push(lead.category)
            leadsPhone.push(lead.phone == undefined ? "telefone indisponivel" : lead.phone)
            leadsRating.push(lead.rating)
            leadsRating.push(lead.stars)
            leadsPlusCode.push(lead.plusCode)  
        })
        console.log(positions)  
    }
    );

    const positions = [];
    const leadsNames = []
    const leadsAdress = []
    const leadsCattegory = []
    const leadsPhone = []
    const leadsRating = []
    const leadsPlusCode = []

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
        zoom: 8,
        center: positions[0], 
        mapId: "DEMO_MAP_ID",
    });



    positions.forEach((position, index) => {

        const infowindow = new google.maps.InfoWindow({
            content:
    `<div id="content">` +
    `<div id="siteNotice">` +
    "</div>" +
    `<h1 id="firstHeading" class="firstHeading">${leadsNames[index]}</h1>` +
    `<div id="bodyContent">` +
    `<p>Plus code: ${leadsPlusCode[index]}</p>` +
    `<p>Avaliações: ${leadsRating[index]}</p>` +
    `<p>Telefone para contato: ${leadsPhone[index]}</p>` +
    `<p>Endereço: ${leadsAdress[index]}</>`+
    
    "</div>" +
    "</div>",
            ariaLabel: leadsAdress[index],
          });
        
        const marker = new google.maps.Marker({
            position: position,
            map,
            title: leadsNames[index],
          });

        marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map,
              });
          
        })

    });

}

initMap();
