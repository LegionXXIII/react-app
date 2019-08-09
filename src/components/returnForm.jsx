import React from "react";
import Form from "./common/form";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import objectId from "joi-objectid";
import { saveReturn } from "../services/returnService";
import { getRental } from "../services/rentalService";

Joi.objectId = objectId(Joi);

class ReturnForm extends Form {
  state = {
    data: {
      customerId: "",
      movieId: ""
    },
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

  async componentDidMount() {
    await this.populateRental();
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
          {this.renderInput("customerId", "Customer Id")}
          {this.renderInput("movieId", "Movie Id")}
          {this.renderButton("Submit")}
        </form>
      </React.Fragment>
    );
  }
}

export default ReturnForm;
