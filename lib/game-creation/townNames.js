const townNames = {}

Object.defineProperties(townNames, {
    "cambodia": {get() {
        return ["Phnom Penh", "Siem Reap", "Battambang", "Preah Sihanouk"]
    }},
    "montenegro": {get() {
        return ["Podgorica", "Nikšić", "Bar", "Bijelo Polje", "Herceg Novi", "Pljevlja", "Berane", "Rožaje", "Kotor", "Budva", "Ulcinj", "Danilovgrad", "Cetinje", "Tivat", "Tuzi"]
    }},
    "peru": {get() {
        return ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Huancayo", "Cusco", "Chimbote", "Iquitos", "Tacna", "Juliaca", "Ica", "Cajamarca", "Pucallpa", "Sullana", "Ayacucho", "Chincha", "Huánuco", "Huacho", "Tarapoto", "Puno", "Paita", "Huaraz", "Tumbes", "Pisco", "Huaral", "Jaén", "Moyobamba", "San Vicente de Cañete", "Puerto Maldonado", "Catacaos", "Moquegua", "Cerro de Pasco", "Barranca", "Yurimaguas", "Chancay", "Andahuaylas", "Ilo", "Talara", "Abancay", "Lambayeque", "Chulucanas", "Tingo María", "Sicuani", "Mala", "Huancavelica", "Ferreñafe", "Chepén", "Pacasmayo", "Tarma", "Sechura", "Guadalupe", "Bagua Grande"]
    }},
    "wisconsin": {get() {
        return ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine", "Appleton", "Waukesha", "Oshkosh", "Eau Claire", "Janesville", "West Allis", "La Crosse", "Sheboygan", "Wauwatosa", "Fond du Lac", "New Berlin", "Wausau", "Brookfield", "Beloit", "Greenfield", "Franklin", "Oak Creek", "Manitowoc", "West Bend", "Sun Prairie", "Superior", "Stevens Point", "Neenah", "Fitchburg", "Muskego", "Watertown", "De Pere", "Mequon", "South Milwaukee", "Marshfield", "Wisconsin Rapids", "Cudahy", "Onalaska", "Middleton", "Menasha", "Menomonie", "Beaver Dam", "Oconomowoc", "Kaukauna", "River Falls", "Whitewater", "Hartford", "Chippewa Falls", "Pewaukee", "Glendale", "Hudson", "Stoughton", "Fort Atkinson", "Baraboo", "Two Rivers", "Cedarburg", "Waupun", "Port Washington", "Platteville", "Marinette", "Monroe", "Verona", "Burlington", "Portage", "Elkhorn", "Reedsburg", "Merrill", "Sparta", "St. Francis", "Shawano", "Sturgeon Bay", "Tomah", "Delavan", "Plymouth", "Rice Lake", "New Richmond", "Antigo", "Ashland", "Jefferson", "Rhinelander", "Sheboygan Falls", "Ripon", "Lake Geneva", "Monona", "New London", "Delafield", "Altoona", "Waupaca", "Prairie du Chien", "Lake Mills", "Milton", "Berlin", "Edgerton", "Richland Center", "Mayville", "Viroqua", "Evansville", "Columbus", "Dodgeville"]
    }},
    "oklahoma": {get() {
        return ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond", "Lawton", "Moore", "Midwest City", "Stillwater", "Enid", "Muskogee", "Owasso", "Bartlesville", "Shawnee", "Yukon", "Bixby", "Ardmore", "Jenks", "Ponca City", "Mustang", "Duncan", "Del City", "Sapulpa", "El Reno", "Sand Springs", "Bethany", "Claremore", "Durant", "Altus", "McAlester", "Ada", "Tahlequah", "Chickasha", "Glenpool", "Miami", "Choctaw", "Woodward", "Weatherford", "Okmulgee", "Guthrie", "Elk City", "Guymon", "Newcastle", "Warr Acres", "Coweta", "The Village", "Pryor Creek", "Wagoner", "Clinton", "Blanchard", "Poteau", "Piedmont", "Sallisaw", "Skiatook", "Cushing", "Tuttle", "Collinsville", "Grove", "Noble", "Seminole", "Catoosa", "Idabel", "Tecumseh", "Blackwell", "Anadarko", "Harrah", "Purcell", "Pauls Valley", "Henryetta", "Holdenville", "Vinita", "Lone Grove", "Hugo", "Sulphur", "Alva"]
    }},
    "zimbabwe": {get() {
        return ["Harare", "Bulawayo", "Chitungwiza", "Mutare", "Epworth", "Gweru", "Kwekwe", "Kadoma", "Masvingo", "Chinhoyi", "Norton", "Marondera", "Ruwa", "Chegutu", "Zvishavane", "Bindura", "Beitbridge", "Redcliff", "Victoria Falls", "Hwange", "Rusape", "Chiredzi", "Kariba", "Karoi", "Chipinge", "Gokwe", "Shurugwi"]
    }}
})

export default townNames