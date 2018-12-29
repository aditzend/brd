
HeaderIndex = new EasySearch.Index({
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {
                createdAt: -1
            };
        },
        selector: function(searchObject, options, aggregation) {
            let selector = this.defaultConfiguration()
                .selector(
                    searchObject, options, aggregation),
                categoryFilter = options.search.props.categoryFilter;

            if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
                selector.category = categoryFilter;
            }

            return selector;
        }
    }),
    collection: Persons,
    fields: ['_id', 'name', 'lastName', 'fin'],
    defaultSearchOptions: {
        limit: 9
    },
    permission: () => {
        //console.log(Meteor.userId());

        return true;
    }
});
CustomersIndex = new EasySearch.Index({
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {
                createdAt: -1
            };
        },
        selector: function(searchObject, options, aggregation) {
            let selector = this.defaultConfiguration()
                .selector(
                    searchObject, options, aggregation),
                categoryFilter = options.search.props.categoryFilter;

            if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
                selector.category = categoryFilter;
            }

            return selector;
        }
    }),
    collection: Cars,
    fields: ['plate'],
    defaultSearchOptions: {
        limit: 9
    },
    permission: () => {
        //console.log(Meteor.userId());

        return true;
    }
});
CompaniesIndex = new EasySearch.Index({
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {
                createdAt: -1
            };
        },
        selector: function(searchObject, options, aggregation) {
            let selector = this.defaultConfiguration()
                .selector(
                    searchObject, options, aggregation),
                categoryFilter = options.search.props.categoryFilter;

            if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
                selector.category = categoryFilter;
            }

            return selector;
        }
    }),
    collection: Companies,
    fields: ['name', 'fin'],
    defaultSearchOptions: {
        limit: 9
    },
    permission: () => {
        //console.log(Meteor.userId());

        return true;
    }
});
VendorsIndex = new EasySearch.Index({
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {
                createdAt: -1
            };
        },
        selector: function(searchObject, options, aggregation) {
            let selector = this.defaultConfiguration()
                .selector(
                    searchObject, options, aggregation),
                categoryFilter = options.search.props.categoryFilter;

            if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
                selector.category = categoryFilter;
            }

            return selector;
        }
    }),
    collection: Companies,
    fields: ['name', 'cuit'],
    defaultSearchOptions: {
        limit: 9
    },
    permission: () => {
        //console.log(Meteor.userId());

        return true;
    }
});
ItemsIndex = new EasySearch.Index({
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {
                createdAt: -1
            };
        },
        selector: function(searchObject, options, aggregation) {
            let selector = this.defaultConfiguration()
                .selector(
                    searchObject, options, aggregation),
                categoryFilter = options.search.props.categoryFilter;

            if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
                selector.category = categoryFilter;
            }

            return selector;
        }
    }),
    collection: Items,
    fields: ['name', 'description'],
    defaultSearchOptions: {
        limit: 9
    },
    permission: () => {
        //console.log(Meteor.userId());

        return true;
    }
});
CarsIndex = new EasySearch.Index({
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {
                createdAt: -1
            };
        },
        selector: function(searchObject, options, aggregation) {
            let selector = this.defaultConfiguration()
                .selector(
                    searchObject, options, aggregation),
                categoryFilter = options.search.props.categoryFilter;

            if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
                selector.category = categoryFilter;
            }

            return selector;
        }
    }),
    collection: Cars,
    fields: ['plate', 'brand', 'model', 'carOwner.lastName'],
    defaultSearchOptions: {
        limit: 9
    },
    permission: () => {
        //console.log(Meteor.userId());

        return true;
    }
});
AgentsIndex = new EasySearch.Index({
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {
                createdAt: -1
            };
        },
        selector: function(searchObject, options, aggregation) {
            let selector = this.defaultConfiguration()
                .selector(
                    searchObject, options, aggregation),
                categoryFilter = options.search.props.categoryFilter;

            if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
                selector.category = categoryFilter;
            }

            return selector;
        }
    }),
    collection: Agents,
    fields: ['DocNumber', 'FirstName', 'LastName'],
    defaultSearchOptions: {
        limit: 9
    },
    permission: () => {
        //console.log(Meteor.userId());

        return true;
    }
});
ProductsIndex = new EasySearch.Index({
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {
                createdAt: -1
            };
        },
        selector: function(searchObject, options, aggregation) {
            let selector = this.defaultConfiguration()
                .selector(
                    searchObject, options, aggregation),
                categoryFilter = options.search.props.categoryFilter;

            if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
                selector.category = categoryFilter;
            }

            return selector;
        }
    }),
    collection: Items,
    fields: ['plate', 'description'],
    defaultSearchOptions: {
        limit: 9
    },
    permission: () => {
        //console.log(Meteor.userId());

        return true;
    }
});
InputsIndex = new EasySearch.Index({
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {
                createdAt: -1
            };
        },
        selector: function(searchObject, options, aggregation) {
            let selector = this.defaultConfiguration()
                .selector(
                    searchObject, options, aggregation),
                categoryFilter = options.search.props.categoryFilter;

            if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
                selector.category = categoryFilter;
            }

            return selector;
        }
    }),
    collection: Items,
    fields: ['name', 'description'],
    defaultSearchOptions: {
        limit: 9
    },
    permission: () => {
        //console.log(Meteor.userId());

        return true;
    }
});
