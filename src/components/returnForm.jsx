import React from "react";
import Form from "./common/form";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import objectId from "joi-objectid";
import { saveReturn } from "../services/returnService";
import { getRental } from "../services/rentalService";
import { getCustomers } from "../services/customerService";
import { getMovies } from "../services/movieService";

Joi.objectId = objectId(Joi);

class ReturnForm extends Form {
  state = {
    data: {
      customerId: "",
      movieId: ""
    },
    customers: [],
    movies: [],
    errors: {}
  };

  schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  async populateRental() {
    try {
      const rentalId = this.props.match.params.id;
      if (!rentalId) return;

      const { data: rental } = await getRental(rentalId);
      this.setState({ data: this.mapToViewModel(rental) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async populateCustomers() {
    const { data: customers } = await getCustomers();
    this.setState({ customers });
  }

  async populateMovies() {
    const { data: allMovies } = await getMovies();
    const movies = allMovies.map(movie => ({
      name: movie.title,
      _id: movie._id
    }));

    this.setState({ movies });
  }

  async componentDidMount() {
    await this.populateRental();
    await this.populateCustomers();
    await this.populateMovies();
  }

  mapToViewModel(rental) {
    return {
      customerId: rental.customer._id,
      movieId: rental.movie._id
    };
  }

  doSubmit = async () => {
    try {
      await saveReturn(this.state.data);
      this.props.history.push("/rentals");
    } catch (ex) {
      if (
        ex.response &&
        ex.response.status >= 400 &&
        ex.response.status < 500
      ) {
        toast.error(ex.response.data);
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <h1>Return Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderSelect("customerId", "Customer", this.state.customers)}
          {this.renderSelect("movieId", "Movie", this.state.movies)}
          {this.renderButton("Submit")}
        </form>
      </React.Fragment>
    );
  }
}

export default ReturnForm;
