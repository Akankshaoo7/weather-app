
import { cn } from "../utils/cn";
export default function WeatherIcon(
  props
) {
  return (
    <div title={props.iconName} className={cn("relative h-20 w-20")}>
      <img
        width={100}
        height={100}
        alt="weather-icon"
        className="absolute h-full w-full"
        src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`}
      />
    </div>
  );
}
