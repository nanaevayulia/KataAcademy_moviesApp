export default class MoviesDB {
  _apiKey = '49719c9afc229ec16612c28950b3aee8';
  _apiToken =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTcxOWM5YWZjMjI5ZWMxNjYxMmMyODk1MGIzYWVlOCIsIm5iZiI6MTcyMjYzMDQyNi43NDc0ODIsInN1YiI6IjY2YTIyZWMyOTViYmFlODQ3ZTM4NDRjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zc93ZBMNIXa-M2-7ESHZR0EYs4B8LcIOBrJ_uc7bEf4';
  _apiBase = 'https://api.themoviedb.org/3/';

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: this._apiToken,
    },
  };

  async getResource(url) {
    try {
      const res = await fetch(`${this._apiBase}${url}`, this.options);

      if (!res.ok) {
        throw new Error(`Could not fetch ${this._apiBase}${url}, received ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error('Возникла проблема с fetch запросом: ', err.message);
      return err.message;
    }
  }

  async searchMovies(query, numberPage = 1) {
    const url = `search/movie?api_key=${this._apiKey}&include_adult=false&query=${query}&page=${numberPage}&language=en-US`;
    return await this.getResource(url);
  }

  async getPopularMovies(numberPage = 1) {
    const url = `movie/popular?api_key=${this._apiKey}&language=en-US&page=${numberPage}`;
    return await this.getResource(url);
  }

  async createGuestSession() {
    const url = 'authentication/guest_session/new';
    const body = await this.getResource(url);
    return body.guest_session_id;
  }

  async setMovieRating(guestId, movieId, rate) {
    const url = `${this._apiBase}/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestId}`;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: this._apiToken,
      },
      body: `{"value": ${rate}}`,
    };

    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error(`Could not fetch ${this._apiBase}${url}, received ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error('Возникла проблема с fetch запросом: ', err.message);
      return err.message;
    }
  }

  async deleteMovieRating(guestId, movieId) {
    const url = `${this._apiBase}movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestId}`;
    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: this._apiToken,
      },
    };

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`Could not fetch ${this._apiBase}${url}, received ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error('Возникла проблема с fetch запросом: ', err.message);
      return err.message;
    }
  }

  async getRatedMovies(guestId, numberPage = 1) {
    const url = `guest_session/${guestId}/rated/movies?language=en-US&page=${numberPage}&api_key=${this._apiKey}&sort_by=created_at.asc`;
    return await this.getResource(url);
  }

  async getGenresList() {
    const url = `genre/movie/list?api_key=${this._apiKey}`;
    const res = await this.getResource(url);
    return res.genres;
  }
}
