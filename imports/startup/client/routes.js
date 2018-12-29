import {
    FlowRouter
}
from 'meteor/kadira:flow-router';
import {
    BlazeLayout
}
from 'meteor/kadira:blaze-layout';
import {
    AccountsTemplates
}
from 'meteor/useraccounts:core';
if (Session.get('theme') == 'light'){
  console.log('im in light');
  import '../../ui/stylesheets/style-light.less';
} else {
  import '../../ui/stylesheets/style.less';
//   console.log('im in dark');

};
import '../../ui/stylesheets/own/timeline.less'
import '../../ui/layouts/app-body.js';
import '../../ui/layouts/header.js';
import '../../ui/layouts/app-nav.js';
import '../../ui/components/navigation/navigation.js';
import '../../ui/components/common/panel.html';
import '../../ui/components/common/panel-tools.js';
import '../../ui/components/common/panel-tools-fullscreen.js';
import '../../ui/components/common/right-sidebar.js';
import '../../ui/components/common/page-title.html';
import '../../ui/components/common/page-header.js';
import '../../api/users/createUser.js';
import '../../ui/pages/profile-show-page.js';
import '../../ui/pages/labels-show-page.js';
import '../../ui/pages/profile-new-page.js';
import '../../ui/pages/dashboard.js';
import '../../ui/pages/login.html';
import '../../ui/pages/reset-password.js';
import '../../ui/pages/landing-page.js';
import '../../ui/pages/treasury-show-page.js';
import '../../ui/pages/order-show-page.js';
import '../../ui/pages/user-show-page.js';
import '../../ui/pages/validated-show-page.js';
import '../../ui/pages/interactions-show-page.js'
import '../../ui/pages/rejected-show-page.js';
import '../../ui/pages/infractors-show-page.js';
import '../../ui/pages/enroled-show-page.js';
import '../../ui/pages/expense-new-page.js';
import '../../ui/pages/create-admin-page.js';
import '../../ui/pages/delivery-note-show-page.js';
import '../../ui/pages/invoice-show-page.js';
import '../../ui/pages/sql-show-page.js';
import '../../ui/layouts/landing-layout.html';
import '../../ui/specs/specs-home.html';

FlowRouter.route('/usuario/:_id/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'showUser',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {
            main: 'User_show_page'
        });
        //console.log('params', params);
    }
});

FlowRouter.route('/enrolados/', {
    name: 'showEnroledUsers',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Enroled_show_page'
        })
    }
})
FlowRouter.route('/validados/', {
    name: 'showValidatedUsers',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Validated_show_page'
        })
    }
})
FlowRouter.route('/interacciones/', {
    name: 'showInteractions',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Interactions_show_page'
        })
    }
})
FlowRouter.route('/rechazados/', {
    name: 'showRejectedUsers',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Rejected_show_page'
        })
    }
})
FlowRouter.route('/infractores/', {
    name: 'showInfractorUsers',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Infractors_show_page'
        })
    }
})

FlowRouter.route('/sql/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'sql',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Sql_show_page'
        });
    }
});


FlowRouter.route('/onloggedin', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action(params, queryParams) {
        if (Meteor.user() && Meteor.user()
            .relatedPerson) {
            FlowRouter.go('/');

        } else {
            FlowRouter.go('/');

        }

    }
});
FlowRouter.route('/create-admin/',{
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'createAdmin',
  action() {
    BlazeLayout.render('App_body', {
      main: 'Create_admin_page'
    });
  }
});
FlowRouter.route('/labels/:_id',{
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'printLabels',
  action(params, queryParams) {
    BlazeLayout.render('App_body', {
      main: 'Labels_show_page'
    });
  }
});
//---------------------------------------------------------------
FlowRouter.route('/show-treasury/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'showTreasury',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {
            main: 'Treasury_show_page'
        });
    }
});

// FlowRouter.route('/create-sale/', {
//     triggersEnter: [AccountsTemplates.ensureSignedIn],
//     name: 'createSale',
//     action() {
//
//         let tooId = TransfersOfOwnership.insert({});
//
//         let forward = '/too/' + tooId;
//
//         FlowRouter.go(forward);
//     }
// // });
// FlowRouter.route('/too/:_id/', {
//     triggersEnter: [AccountsTemplates.ensureSignedIn],
//     name: 'too',
//     action(params, queryParams) {
//         BlazeLayout.render('App_body', {
//             main: 'Sales_new_page'
//         });
//         console.log('params', params);
//
//     }
// });
FlowRouter.route('/too/sale/:_id/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'createSale',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {
            main: 'Sales_new_page'
        });
        //console.log('params', params);
    }
});
FlowRouter.route('/order/:_id/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'showOrder',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {
            main: 'Order_show_page'
        });
        //console.log('params', params);
    }
});
FlowRouter.route('/delivery-note/:_id/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'showDeliveryNote',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {
            main: 'DeliveryNote_show_page'
        });
        //console.log('params', params);

    }
});
FlowRouter.route('/invoice/:_id/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'showInvoice',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {
            main: 'Invoice_show_page'
        });
        //console.log('params', params);

    }
});
FlowRouter.route('/orders/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'showOrders',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {
            main: 'Orders_show_page'
        });
        //console.log('params', params);

    }
});
FlowRouter.route('/too/expense/:_id/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'createExpense',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {
            main: 'Expense_new_page'
        });
        //console.log('params', params);

    }
});




//home always renders the dashboard
FlowRouter.route('/', {
    name: 'home',
    action: function() {
        if (Meteor.userId()) {
            BlazeLayout.render('App_body', {
                main: "Dashboard"
            });
        } else {
            BlazeLayout.render('Landing_layout', {
                main: "Landing_page"

            });
        }

    }
});
//developer notes
FlowRouter.route('/specs', {
    name: 'specsHome',
    action: function() {
        if (Meteor.userId()) {
            BlazeLayout.render('App_body', {
                main: "SpecsHome"
            });
        } else {
            BlazeLayout.render('Landing_layout', {
                main: "Landing_page"

            });
        }

    }
});
FlowRouter.route('/landing', {
    name: 'landing',
    action: function() {

        BlazeLayout.render('Landing_layout', {
            main: "Landing_page"

        });



    }
});

// AccountsTemplates.configureRoute('resetPwd', {
//     name: 'resetPwd',
//     path: '/reset-password',
// });

FlowRouter.route('/exit', {
    name: 'exit',
    action: function() {
        AccountsTemplates.logout();
        BlazeLayout.render('AT_layout', {
            main: "Exit"
        });
    }
});



//-------------------AccountsTemplates------------------------
AccountsTemplates.configureRoute('signIn', {
    layoutType: 'blaze',
    name: 'signin',
    path: '/login',
    //template: 'myLogin',
    layoutTemplate: 'login',
    // layoutTemplate: 'AT_layout',
    layoutRegions: {},
    contentRegion: 'main'
});




AccountsTemplates.configureRoute('changePwd', {
    layoutType: 'blaze',
    name: 'changePwd',
    path: '/change-password',
    //template: 'myLogin',
    //layoutTemplate: 'AT_layout',
    layoutTemplate: 'login',
    layoutRegions: {},
    contentRegion: 'main'
});
//AccountsTemplates.configureRoute('resetPwd');

FlowRouter.route('/reset-password', {
    name: 'resetPwd',
    action: function() {

        BlazeLayout.render('Landing_layout', {
            main: "resetPassword"

        });



    }
});


//------------------------------------------------------------


//-------------------CREATE-----------------------------------
FlowRouter.route('/create-company', {
    name: 'createCompany',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Company_create'
        });
        Session.set('showCreateOptions', false);
    }
});


FlowRouter.route('/create-item', {
    name: 'createItem',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Item_create'
        });
        Session.set('showCreateOptions', false);
    }
});

FlowRouter.route('/create-generic/', {
    name: 'createGeneric',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Generic_create'
        });
        Session.set('showCreateOptions', false);
    }
});


//---------------------------------------------------------------
//--------------------PROFILE---------------------------------------
FlowRouter.route('/profile/', {
    name: 'Profile.show',
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action() {
        BlazeLayout.render('App_body', {
            main: 'Profile_show_page'
        });
    }
});
FlowRouter.route('/profile/new', {
    name: 'Profile.new',
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action() {
        BlazeLayout.render('App_body', {
            main: 'Profile_new_page'
        });
    }
});



//--------------------SHOW---------------------------------------
FlowRouter.route('/show-generic/:_id', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'showGeneric',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Generic_show'
        });
    }
});
FlowRouter.route('/show-generics/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'showGenerics',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Generics_show'
        });
    }
});

FlowRouter.route('/show-2/:_id', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'showCompany',
    action() {
        BlazeLayout.render('App_body', {
            main: 'Company_show'
        });
    }
});



FlowRouter.route('/show-person-profile/:_id', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'showContact',
    action(params) {
        BlazeLayout.render('App_body', {
            main: 'Contact_show_profile_page'
        });
        //Session.set('url_id', params._id);
    }
});
//---------------------------------------------------------------

FlowRouter.route('/test-landing-options', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action(params, queryParams) {
        BlazeLayout.render('App_body', {
            main: 'testLandingOptions'
        });
    }
});
