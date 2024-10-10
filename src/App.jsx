import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [poke, setPoke] = useState({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchPoke = async () => {
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=10000"
      );

      setPoke(res.data);
      setIsLoading(false);
    };

    fetchPoke();
  }, []);

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!isLoading) {
        const arr = poke.results.filter((poke) => {
          if (poke.name.includes(input)) return poke;
        });

        let pokemons = [];

        arr.forEach(async (poke) => {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${poke.name}`
          );

          pokemons.push({ name: poke, data: response.data });
        });

        setPokemonData(pokemons);
      }
    };

    const timeout = setTimeout(fetchPokemon, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [input]);

  if (isLoading) return <div>LOADING...</div>;

  return (
    <div>
      <input
        placeholder="pokemon name"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      {pokemonData &&
        pokemonData.length > 0 &&
        pokemonData.map((poke) => (
          <div key="">
            {poke.name} - {poke.abilities[0].ability.name}
          </div>
        ))}
    </div>
  );
}
