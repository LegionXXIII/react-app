import React, { Component } from "react";
import CustomersTable from "./customersTable";
import Pagination from "./common/pagination";
import SearchBox from "./searchBox";
import { Link } from "react-router-dom";
import { getCustomers, deleteCustomer } from "../services/customerService";
import { paginate } from "../utils/paginate";
import { toast } from "react-toastify";
import _ from "lodash";

class Customers extends Component {
  state = {
    customers: [],
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" }
  };

  async componentDidMount() {
    const { data: customers } = await getCustomers();
    customers.map(customer => (customer.isGold = String(customer.isGold)));
    this.setState({ customers });
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleDelete = async customer => {
    const originalCustomers = this.state.customers;
    const customers = this.state.customers.filter(c => c._id !== customer._id);
    this.setState({ customers });

    try {
      await deleteCustomer(customer._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This customer has already been deleted.");

      this.setState({ customers: originalCustomers });
    }
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      customers: allCustomers,
      searchQuery,
      sortColumn
    } = this.state;

    let filtered = allCustomers;
    if (searchQuery)
      filtered = allCustomers.filter(
        c =>
          c.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          c.phone.startsWith(searchQuery)
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const customers = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: customers };
  };

  render() {
    const { sortColumn, pageSize, currentPage, searchQuery } = this.state;

    const { totalCount, data: customers } = this.getPagedData();

    return (
      <React.Fragment>
        {this.props.user && (
          <Link
            to="/customers/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Customer
          </Link>
        )}
        <p>Showing {totalCount} customers in the database</p>
        <SearchBox value={searchQuery} onChange={this.handleSearch} />
        <CustomersTable
          customers={customers}
          sortColumn={sortColumn}
          onSort={this.handleSort}
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

export default Customers;
