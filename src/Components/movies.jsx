import React, { Component } from "react";
import { deleteMovie, getMovies } from "../services/fakeMovieService";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import { paginate } from "./utils/pagination";
import { getGenres } from "../services/fakeGenreService";
import ListGroup from "./common/listGroup";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    selectedGenre: 0,
    currentPage: 1,
    pageSize: 4,
    sortColumn: { path: "title", order: "asc" },
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

  handleDelete = (movie) => {
    console.log(this.state.movies);
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    //deleteMovie({  });
    //deleteMovie(movie._id);
    this.setState({ movies });
  };

  handleLikes = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    //console.log(page);
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    //console.log(genre);
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      selectedGenre,
      sortColumn,
      movies: AllMovies,
    } = this.state;

    if (count === 0) return <p>There are no movies</p>;

    const filtered =
      selectedGenre && selectedGenre._id
        ? AllMovies.filter((m) => m.genre._id === selectedGenre._id)
        : AllMovies;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return (
      <div>
        <p>Showing {filtered.length} movies in Database</p>
        <div className="row">
          <div className="col-2">
            <ListGroup
              items={this.state.genres}
              /* textProperty="name"
              valueProperty="_id" */
              selectedItem={this.state.selectedGenre}
              onItemSelect={this.handleGenreSelect}
            />
          </div>
          <div className="col">
            <MoviesTable
              movies={movies}
              sortColumn={sortColumn}
              onLike={this.handleLikes}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
            />
            <Pagination
              className="Pagination"
              itemsCount={filtered.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
