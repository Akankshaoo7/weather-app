import {getCities} from "../services/cities";
import {useEffect, useState} from "react";

function CitiesTable() {

const [cities, setCities] = useState([]);
const [offset, setOffset] = useState(0);

const fetchCities = async ()=>{
    try {
        const response = await getCities(offset);
        setCities(response.data.results);
    } catch (error) {
        console.log(error);
    }
}

useEffect(() => {
    fetchCities();
},[]);

const citiesJSX = cities.map((city)=>(
<tr key = {city.geoname_id}>
    <td>{city.name}</td>
    <td>{city.cou_name_en}</td>
    <td>{city.timezone}</td>
</tr>
))
    return (
         <div>
            <div>
                <input
                    type="text"
                    placeholder="Search cities..."
                />
                <table>
                    <thead>
                        <tr>
                            <th>City Name</th>
                            <th>Country Name</th>
                            <th>Timezone</th>
                        </tr>
                    </thead>
                    <tbody>

                      {citiesJSX}

                    </tbody>
                </table>
            </div>
        </div>
   )
}

export default CitiesTable;