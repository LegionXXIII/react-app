import React from "react";
import Form from "./common/form";
import { saveRental } from "../services/rentalService";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import objectId from "joi-objectid";
import { getCustomers } from "../services/customerService";
import { getMovies } from "../services/movieService";

Joi.objectId = objectId(Joi);

class RentalForm extends Form {
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
    await this.populateCustomers();
    await this.populateMovies();
  }

  doSubmit = async () => {
    try {
      await saveRental(this.state.data);
      this.props.history.push("/rentals");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <h1>Rental Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderSelect("customerId", "Customer", this.state.customers)}
          {this.renderSelect("movieId", "Movie", this.state.movies)}
          {this.renderButton("Submit")}
        </form>
      </React.Fragment>
    );
  }
}

export default RentalForm;
