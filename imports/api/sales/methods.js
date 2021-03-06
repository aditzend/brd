import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';
import moment from 'moment/moment';

function dailyKm(km, year) {
    let age = km /
        (
            (moment().year() - year) * 12 * 30
        );
    return age.toFixed(0);
};

//calcula la fecha de recambio o dueDate
function dueDate(exchange, uom, saleCreatedAt, dailyKm) {
    let add;
    let unit;
    switch (uom) {
        case "km":
            add = exchange / dailyKm;
            unit = 'days'
            break;
        case "year":
            add = exchange;
            unit = 'years'
            break;
        case "month":
            add = exchange;
            unit = 'months'
    }
    return moment(saleCreatedAt).add(add, unit).toISOString();
};



Meteor.methods({
    'sales.insert' (data) {
        check(data, Object);
        const car = Cars.findOne({_id: data.car.id});
        const family = Families.findOne({_id: data.family.id});
        const dkm = dailyKm(car.km,car.year);
        const due = dueDate(family.exchange,
                            family.uom,
                            moment().toISOString(),
                        dkm);
        if (!Meteor.user()) {
            throw new Meteor.Error("no autorizado");
        }
        const sale = Sales.insert({
            car: {
                id: car._id
            },
            family: {
                id: family._id,
                name: family.name
            },
            dueDate: due,
            createdAt: moment().toISOString(),
            owner: family.owner,
            status:"ALIVE"
        });
        Meteor.call('saveEmailJob',car.carOwner.email,car.carOwner.givenName,family.name,due,family.owner, sale);
    },
    'sales.delete'(id) {
           if (!Meteor.user()) {
               throw new Meteor.Error("no autorizado");
           }
           Sales.remove({
              _id:id
           });
    }
});