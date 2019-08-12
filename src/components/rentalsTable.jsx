import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";
import auth from "../services/authService";

class RentalsTable extends Component {
  columns = [
    {
      path: "_id",
      label: "Rental Id",
      content: rental => <Link to={`/returns/${rental._id}`}>{rental._id}</Link>
    },
    { path: "customer.name", label: "Name" },
    { path: "customer.phone", label: "Phone" },
    { path: "movie.title", label: "Movie Title" },
    { path: "dateOut", label: "Date Out" },
    { path: "dateReturned", label: "Date Returned" },
    { path: "rentalFee", label: "Rental Fee" }
  ];

  deleteColumn = {
    key: "delete",
    content: rental => (
      <button
        onClick={() => this.props.onDelete(rental)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();

    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }

  render() {
    const { sortColumn, onSort, rentals } = this.props;

    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={rentals}
      />
    );
  }
}

export default RentalsTable;
