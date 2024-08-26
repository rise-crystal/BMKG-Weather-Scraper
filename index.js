import axios from 'axios';
import { parseString } from 'xml2js';

// Array nama data & file
const data = [
    'DigitalForecast-Aceh.xml', // provinsi aceh
    'DigitalForecast-Bali.xml', // provinsi bali
    'DigitalForecast-BangkaBelitung.xml', // provinsi bangka belitung
    'DigitalForecast-Banten.xml', // provinsi banten
    'DigitalForecast-Bengkulu.xml', // provinsi bengkulu
    'DigitalForecast-DIYogyakarta.xml', // provinsi DI Yogyakarta
    'DigitalForecast-DKIJakarta.xml', // provinsi DKI Jakarta
    'DigitalForecast-Gorontalo.xml', // provinsi Gorontalo
    'DigitalForecast-Jambi.xml', // provinsi Jambi
    'DigitalForecast-JawaBarat.xml', // provinsi Jawa Barat
    'DigitalForecast-JawaTengah.xml', // provinsi Jawa Tengah
    'DigitalForecast-JawaTimur.xml', // provinsi Jawa Timur
    'DigitalForecast-KalimantanBarat.xml', // provinsi Kalimantan Barat
    'DigitalForecast-KalimantanSelatan.xml', // provinsi Kalimantan Selatan
    'DigitalForecast-KalimantanTengah.xml', // provinsi Kalimantan Tengah
    'DigitalForecast-KalimantanTimur.xml', // provinsi Kalimantan Timur
    'DigitalForecast-KalimantanUtara.xml', // provinsi Kalimantan Utara
    'DigitalForecast-KepulauanRiau.xml', // provinsi Kepulauan Riau
    'DigitalForecast-Lampung.xml', // provinsi Lampung
    'DigitalForecast-Maluku.xml', // provinsi Maluku
    'DigitalForecast-MalukuUtara.xml', // provinsi Maluku Utara
    'DigitalForecast-NusaTenggaraBarat.xml', // provinsi Nusa Tenggara Barat
    'DigitalForecast-NusaTenggaraTimur.xml', // provinsi Nusa Tenggara Timur
    'DigitalForecast-Papua.xml', // provinsi Papua
    'DigitalForecast-PapuaBarat.xml', // provinsi Papua Barat
    'DigitalForecast-Riau.xml', // provinsi Riau
    'DigitalForecast-SulawesiBarat.xml', // provinsi Sulawesi Barat
    'DigitalForecast-SulawesiSelatan.xml', // provinsi Sulawesi Selatan
    'DigitalForecast-SulawesiTengah.xml', // provinsi Sulawesi Tengah
    'DigitalForecast-SulawesiTenggara.xml', // provinsi Sulawesi Tenggara
    'DigitalForecast-SulawesiUtara.xml', // provinsi Sulawesi Utara
    'DigitalForecast-SumateraBarat.xml', // provinsi Sumatera Barat
    'DigitalForecast-SumateraSelatan.xml', // provinsi Sumatera Selatan
    'DigitalForecast-SumateraUtara.xml', // provinsi Sumatera Utara
    'DigitalForecast-Indonesia.xml' // provinsi Indonesia
];

// Index file yang ingin diambil
const index = 1; // Memilih file provinsi Bali

// Cek apakah index valid
if (index >= data.length) {
    console.error('404 not found: The requested data does not exist.');
} else {
    // Data yang ingin diambil
    const df = data[index];

    // URL dari file XML
    const url = `https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/${df}`;

    // Nama area yang ingin dicari dalam bahasa Indonesia
    const query = 'Kab. Badung';

    // Fungsi untuk mengambil dan memparsing data XML
    async function fetchData() {
        try {
            const response = await axios.get(url);
            const xmlData = response.data;

            // Parsing XML ke JSON
            parseString(xmlData, (err, result) => {
                if (err) {
                    throw err;
                }

                // Mengambil semua elemen 'area'
                const areas = result?.data?.forecast?.[0]?.area;
                if (areas) {
                    // Filter untuk menampilkan data yang sesuai dengan query dalam bahasa Indonesia (id_ID)
                    const filteredAreas = areas.filter(area => {
                        const nameElements = area?.name || [];
                        return nameElements.some(nameElement =>
                            nameElement._.trim() === query && nameElement.$['xml:lang'] === 'id_ID'
                        );
                    });

                    if (filteredAreas.length > 0) {
                        filteredAreas.forEach(area => {
                            const nameElement = area?.name?.find(name => name.$['xml:lang'] === 'id_ID');
                            const name = nameElement?._;
                            const description = area?.$?.description;
                            const latitude = area?.$?.latitude;
                            const longitude = area?.$?.longitude;

                            // Menampilkan informasi area termasuk Name
                            console.log(`Name: ${name}`);
                            console.log(`Description: ${description}`);
                            console.log(`Latitude: ${latitude}`);
                            console.log(`Longitude: ${longitude}`);
                            console.log('------------------------');

                            // Menampilkan informasi cuaca dalam format tabel
                            const weatherElements = area?.parameter || [];
                            weatherElements.forEach(element => {
                                const weatherType = element?.$?.id;
                                const timeranges = element?.timerange || [];
                                
                                const weatherData = timeranges.map(timerange => {
                                    const datetime = timerange?.$?.datetime;
                                    const formattedDatetime = `${datetime.slice(0, 4)}-${datetime.slice(4, 6)}-${datetime.slice(6, 8)} ${datetime.slice(8, 10)}:${datetime.slice(10, 12)}`;
                                    const weatherValue = timerange?.value?.[0]?._;
                                    return {
                                        Time: formattedDatetime,
                                        'Weather Type': weatherType,
                                        Value: weatherValue
                                    };
                                });

                                console.table(weatherData);
                            });
                        });
                    } else {
                        console.log(`No areas found with description: ${query}`);
                        console.log('Available areas:');
                        areas.forEach(area => {
                            const names = area?.name || [];
                            const idName = names.find(name => name.$['xml:lang'] === 'id_ID');
                            const enName = names.find(name => name.$['xml:lang'] === 'en_US');
                            console.log(`- ${idName?._} (Kota ${enName?._})`);
                        });
                    }
                } else {
                    console.error('No areas found in the data.');
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Memanggil fungsi fetchData
    fetchData();
}
