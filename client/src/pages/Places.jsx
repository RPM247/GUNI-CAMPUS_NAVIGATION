import { useNavigate } from "react-router-dom";

const Places = () => {
  const navigate = useNavigate();

  const places = [
    { name: "Hostels", icon: "🏨", route: "/places/hostel", value: "hostel" },
    { name: "Colleges", icon: "🏫", route: "/places/college", value: "college" },
    { name: "Mess", icon: "🍽", route: "/places/mess", value: "mess" },
    { name: "Sports Complex", icon: "🏀", route: "/places/sports", value: "sports" },
    { name: "Gym", icon: "🏋️", route: "/places/gym", value: "gym" },
    { name: "Hospital", icon: "🏥", route: "/places/hospital", value: "hospital" },
    { name: "Parking", icon: "🅿️", route: "/places/parking", value: "parking" },
    { name: "Canteen", icon: "🍔", route: "/places/canteen", value: "canteen" },
    { name: "Others", icon: "⋮", route: "/places/others", value: "others" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-2xl font-bold my-4">Choose a place to visit</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {places.map((place, index) => (
          <div
            key={index}
            onClick={() => navigate(place.route, { state: { category: place.value } })}
            className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-gray-200 transition transform hover:scale-105"
          >
            <span className="text-4xl">{place.icon}</span>
            <p className="mt-2 text-lg font-semibold">{place.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Places;
