
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

// Form schema with new fields
const gameFormSchema = z.object({
  opponent_name: z.string().min(1, "Opponent name is required"),
  game_date: z.date({
    required_error: "Game date is required",
  }),
  game_start_time: z.string().optional(),
  game_type: z.enum(["League", "Friendly", "Tournament", "Scrimmage"]).optional(),
  game_duration_minutes: z.number().min(10).max(120).default(40),
  quarter_length_minutes: z.number().min(5).max(20).default(10),
  is_home_game: z.boolean().default(true),
  opponent_team_level: z.enum(["10U", "11U", "12U", "13U", "14U", "15U", "16U", "17U"]).optional(),
  game_notes: z.string().optional(),
  is_private: z.boolean().default(false),
  location: z.string().optional(),
  include_opponent_roster: z.boolean().default(false),
  opponent_team_name: z.string().optional(),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

interface CreateGameFormProps {
  onSubmitGame: (data: GameFormValues & { opponent_players?: string[] }) => Promise<void>;
  isSubmitting?: boolean;
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({ 
  onSubmitGame,
  isSubmitting = false
}) => {
  const [opponentPlayers, setOpponentPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [bulkPlayerText, setBulkPlayerText] = useState("");

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      opponent_name: "",
      game_date: new Date(),
      game_start_time: "",
      game_type: "Friendly",
      game_duration_minutes: 40,
      quarter_length_minutes: 10,
      is_home_game: true,
      opponent_team_level: "12U",
      game_notes: "",
      is_private: false,
      location: "",
      include_opponent_roster: false,
      opponent_team_name: "",
    },
  });

  const watchIncludeRoster = form.watch("include_opponent_roster");

  const addOpponentPlayer = () => {
    if (newPlayerName.trim()) {
      setOpponentPlayers([...opponentPlayers, newPlayerName.trim()]);
      setNewPlayerName("");
    }
  };

  const removeOpponentPlayer = (index: number) => {
    setOpponentPlayers(opponentPlayers.filter((_, i) => i !== index));
  };

  const addBulkPlayers = () => {
    if (bulkPlayerText.trim()) {
      const newPlayers = bulkPlayerText
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);
      
      setOpponentPlayers([...opponentPlayers, ...newPlayers]);
      setBulkPlayerText("");
    }
  };

  const handleSubmit = async (values: GameFormValues) => {
    await onSubmitGame({
      ...values,
      opponent_players: watchIncludeRoster ? opponentPlayers : undefined
    });
    form.reset();
    setOpponentPlayers([]);
    setNewPlayerName("");
    setBulkPlayerText("");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Game Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Game Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="opponent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opponent / Game Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter opponent team or game name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Name of the opposing team or custom game session
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="game_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Game Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="game_start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="time"
                          placeholder="Select time" 
                          {...field} 
                        />
                        <Clock className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Game location or venue" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Game Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Game Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="game_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select game type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="League">League</SelectItem>
                        <SelectItem value="Friendly">Friendly</SelectItem>
                        <SelectItem value="Tournament">Tournament</SelectItem>
                        <SelectItem value="Scrimmage">Scrimmage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="opponent_team_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opponent Team Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10U">10U</SelectItem>
                        <SelectItem value="11U">11U</SelectItem>
                        <SelectItem value="12U">12U</SelectItem>
                        <SelectItem value="13U">13U</SelectItem>
                        <SelectItem value="14U">14U</SelectItem>
                        <SelectItem value="15U">15U</SelectItem>
                        <SelectItem value="16U">16U</SelectItem>
                        <SelectItem value="17U">17U</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="game_duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="10"
                        max="120"
                        placeholder="40" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 40)}
                      />
                    </FormControl>
                    <FormDescription>Total game time in minutes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quarter_length_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quarter Length (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="5"
                        max="20"
                        placeholder="10" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                      />
                    </FormControl>
                    <FormDescription>Length of each quarter</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_home_game"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Home / Away</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "home")}
                      value={field.value ? "home" : "away"}
                      className="flex flex-row space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home" id="home" />
                        <Label htmlFor="home">Home Game</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="away" id="away" />
                        <Label htmlFor="away">Away Game</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="game_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes about this game..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Notes about strategy, conditions, or other important details
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Game Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="is_private"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Private Practice Game</FormLabel>
                    <FormDescription>
                      Mark this as a private practice session (only visible to you)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="include_opponent_roster"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include Opponent Roster</FormLabel>
                    <FormDescription>
                      Add opposing team players for complete box scores
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {watchIncludeRoster && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-900">Opponent Team Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="opponent_team_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opponent Team Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter official team name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel>Opponent Players</FormLabel>
                
                {/* Manual entry */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add player name"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOpponentPlayer())}
                  />
                  <Button 
                    type="button" 
                    onClick={addOpponentPlayer}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Bulk entry */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Or paste multiple names (one per line)"
                    className="text-sm"
                    rows={3}
                    value={bulkPlayerText}
                    onChange={(e) => setBulkPlayerText(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    onClick={addBulkPlayers}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    Add All Players
                  </Button>
                </div>

                {/* Player list */}
                {opponentPlayers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Opponent Players ({opponentPlayers.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opponentPlayers.map((player, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="flex items-center gap-1"
                        >
                          {player}
                          <button
                            type="button"
                            onClick={() => removeOpponentPlayer(index)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Game..." : "Create Game"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateGameForm;
