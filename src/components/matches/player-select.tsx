import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Player {
  player_id: string;
  name: string;
}

interface PlayerSelectProps {
  players: Player[];
  onChange: (playerId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  value: string | null;
}

const PlayerSelect = ({
  players,
  onChange,
  placeholder = "Select player",
  disabled = false,
  value
}: PlayerSelectProps) => {
  return (
    <Select
      disabled={disabled}
      value={value || undefined}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {players.map((player) => (
          <SelectItem key={player.player_id} value={String(player.player_id)}>
            {player.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default PlayerSelect;