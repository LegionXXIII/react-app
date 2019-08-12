import React, { Component } from "react";
import RentalsTable from "./rentalsTable";
import SearchBox from "./searchBox";
import Pagination from "./common/pagination";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getRentals, deleteRental } from "../services/rentalService";
import { paginate } from "../utils/paginate";
import _ from "lodash";

class Rentals extends Component {
  state = {
    rentals: [],
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    sortColumn: { path: "dateOut", order: "asc" }
  };

  async componentDidMount() {
    const { data: rentals } = await getRentals();
    rentals.map(rental => {
      return (rental.dateOut = new Date(rental.dateOut).toLocaleDateString());
    });

    rentals.map(rental => {
      if (!rental.dateReturned) {
        rental.dateReturned = "-";
        rental.rentalFee = "-";
        return;
      }
      return (rental.dateReturned = new Date(
        rental.dateReturned
      ).toLocaleDateString());
    });

    this.setState({ rentals });
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleDelete = async rental => {
    const originalRentals = this.state.rentals;
    const rentals = this.state.rentals.filter(r => r._id !== rental._id);
    this.setState({ rentals });

    try {
      await deleteRental(rental._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This rental has already been deleted.");

      this.setState({ rentals: originalRentals });
    }
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      rentals: allRentals,
      searchQuery,
      sortColumn
    } = this.state;

    let filtered = allRentals;
    if (searchQuery)
      filtered = allRentals.filter(r =>
        r.customer.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const rentals = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: rentals };
  };

  render() {
    const { sortColumn, searchQuery, pageSize, currentPage } = this.state;
    const { totalCount, data: rentals } = this.getPagedData();

    return (
      <React.Fragment>
        {this.props.user && (
          <Link
            to="/rentals/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Rental
          </Link>
        )}

        {this.props.user && (
          <Link
            to="/returns"
            className="btn btn-primary"
            style={{ marginBottom: 20, marginLeft: 20 }}
          >
            Return
          </Link>
        )}

        <p>Showing {totalCount} rental/s in the database</p>
        <SearchBox value={searchQuery} onChange={this.handleSearch} />
        <RentalsTable
          sortColumn={sortColumn}
          onSort={this.handleSort}
          rentals={rentals}
          onDelete={this.handleDelete}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

export default Rentals;
