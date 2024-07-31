export default class MoviesDB {
  _apiKey = '49719c9afc229ec16612c28950b3aee8';
  _apiToken =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTcxOWM5YWZjMjI5ZWMxNjYxMmMyODk1MGIzYWVlOCIsIm5iZiI6MTcyMTk4Mjk1Ny4yOTIzMDQsInN1YiI6IjY2YTIyZWMyOTViYmFlODQ3ZTM4NDRjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ruNhBFlSdUsea3LDS3AEBiJjMOAEmCDjnMbtLHNoca8';
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

  async getMovies(query, numberPage) {
    const url = `search/movie?api_key=${this._apiKey}include_adult=false&query=${query}&page=${numberPage}&language=en-US`;
    return await this.getResource(url);
  }
}
