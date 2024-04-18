import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
const { VITE_APP_BACKEND_URL } = import.meta.env;
import ReviewForm from './ReviewForm';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './favoritebutton.css';
import Reviews from './Reviews';

const MovieDetails = ({profileId}) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${VITE_APP_BACKEND_URL}/movie/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Hakuvirhe:', error);
      }
    };

    const fetchProviders = async () => {
      try {
        const response = await axios.get(`${VITE_APP_BACKEND_URL}/movie/provider/${id}`);
        setProviders(response.data);
      } catch (error) {
        // Jos pyyntö epäonnistuu, asetetaan providers-tila tyhjään JSON-objektiin
        setProviders({});
      }
    };

    fetchMovie();

    // Asetetaan timeout fetchProviders-funktiolle 5 sekunniksi
    const timeoutId = setTimeout(fetchProviders, 100);

    // Palautetaan poisto-funktio, joka suoritetaan komponentin purkamisen yhteydessä
    return () => clearTimeout(timeoutId);
  }, [id]);

  //lisätään elokuva suosikkeihin
  console.log(movie, profileId)
  useEffect(() => {
  
    setIsFavorite();
  }, []);
const addToFavorites = async () => {
    try {
      // Tarkistetaan, että käyttäjä on kirjautunut sisään
      if (profileId !== null) {
        if (movie && profileId) { 
          const data = {
            favoriteditem: movie.title,
            showtime: new Date(),
            groupid: null,
            profileId: profileId,
          };
          axios.post(`${VITE_APP_BACKEND_URL}/favoritelist`, data)
            .then(response => {
              console.log(response.data);
              setIsFavorite(true); 
            })
            .catch(error => {
              console.error('Virhe lisättäessä suosikkeihin:', error);
            });
        } else {
          console.error('Elokuvaa tai profiilitunnistetta ei löydy');
        }
      } else {
        console.error('Käyttäjä ei ole kirjautunut sisään');
      }
    } catch (error) {
      console.error('Jotain meni vikaan:', error);
    }
    setIsFavorite(true);
  };
    // poistetaan suosikeista elokuva
    const deleteFromFavorites = () => {
      setIsFavorite(false); // 
    };

  return (
    <div id="backdrop" style={movie && { backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`, backgroundSize: 'cover' }}>
      <div className="content">

        {movie && (
          <div id="backdropbg">

            <div className="moviemain">
            <div style={{ position: 'relative' }}>
            <button className="favorite-button" onClick={isFavorite ? deleteFromFavorites : addToFavorites}>
            {isFavorite ? <FaHeart className="favorite-icon" size={34} /> : <FaRegHeart size={34} />}
          </button>
              <img className="posterimg" src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} alt={movie.title} />
              </div>
              <div className="movieinfo">

                <h2>{movie.title}</h2>
                <p><b>Kuvaus:</b> {movie.overview}</p>
                <p><b>Kesto:</b> {movie.runtime} min</p>
                <p><b>Genre:</b> {movie.genres.map(genre => genre.name).join(', ')}</p>
                <p><b>Julkaistu:</b> {movie.release_date}</p>
                <p><b>Tuotantoyhtiöt:</b> {movie.production_companies.map(company => company.name).join(', ')}</p>
                <p><b>Kerännyt ääniä:</b> {movie.vote_count}</p>
                <p><b>Äänten keskiarvo:</b> {movie.vote_average} / 10 </p>
                <button onClick={() => deletefromFavorites(movie)}>Poista</button>


                {providers && providers.flatrate && providers.rent && (
                  <table className='providers'>
                    <tbody>
                      <tr>
                        <td><h3>Katso</h3></td>
                        {providers.flatrate.map(provider => (
                          <td key={provider.provider_id}>
                            <a href={`https://www.themoviedb.org/movie/${movie.id}/watch`}><img src={`https://image.tmdb.org/t/p/w185${provider.logo_path}`} alt={provider.provider_name} /></a>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td><h3>Vuokraa</h3></td>
                        {providers.rent.map(provider => (
                          <td key={provider.provider_id}>
                            <a href={`https://www.themoviedb.org/movie/${movie.id}/watch`}><img src={`https://image.tmdb.org/t/p/w185${provider.logo_path}`} alt={provider.provider_name} /></a>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td colSpan="6">
                          <a href='https://www.justwatch.com/'>Saatavuus Suomessa JustWatch</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                
              </div>
            </div>

            <div className="moviereviews">

              <div><ReviewForm movieId={id} /></div>

              <br/>
              <h2>Viimeisimmät arvostelut</h2>

              <div className="reviewslisted"><Reviews movieId={id} mediatype={0}/></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
