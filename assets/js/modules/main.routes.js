angular.module('mainApp')
.config(['$stateProvider', function($stateProvider) {
  	$stateProvider
    .state("home", {
        url: "/",
        // template: "",
        // templateUrl: "templates/home.html",
        controller: "NaviHome",
        public: true
    })
    //User Routes
  	.state("usernew", {
  		url: "/user/new",
  		templateUrl: "templates/user/new.html",
  		controller: "UserNew",
        keepdata: true
  	})
  	.state("userlist", {
  		url: "/user/list",
  		templateUrl: "templates/user/list.html",
        controller: "UserList"
    })
  	.state("usershow", {
  		url: "/user/:id",
  		templateUrl: "templates/user/show.html",
        controller: "UserShow"
  	})
    //Role Routes
    .state("rolenew", {
        url: "/role/new",
        templateUrl: "templates/role/new.html",
        controller: "RoleNew",
        keepdata: true
    })
    .state("rolelist", {
        url: "/role/list",
        templateUrl: "templates/role/list.html",
        controller: "RoleList"
    })
    .state("roleshow", {
        url: "/role/:id",
        templateUrl: "templates/role/show.html",
        controller: "RoleShow"
    })
    //Category Routes
    .state("categorynew", {
        url: "/category/new",
        templateUrl: "templates/category/new.html",
        controller: "CategoryNew",
        keepdata: true
    })
    .state("categorylist", {
        url: "/category/list",
        templateUrl: "templates/category/list.html",
        controller: "CategoryList"
    })
    .state("categoryshow", {
        url: "/category/:id",
        templateUrl: "templates/category/show.html",
        controller: "CategoryShow"
    })
    //Subcategory Routes
    .state("subcategorynew", {
        url: "/subcategory/new/:id",
        templateUrl: "templates/subcategory/new.html",
        controller: "SubcategoryNew",
        keepdata: true
    })
    .state("subcategorylist", {
        url: "/subcategory/list/:id",
        templateUrl: "templates/subcategory/list.html",
        controller: "SubcategoryList"
    })
    .state("subcategoryshow", {
        url: "/subcategory/:id",
        templateUrl: "templates/subcategory/show.html",
        controller: "SubcategoryShow"
    })
    //Unit Routes
    .state("unitnew", {
        url: "/unit/new",
        templateUrl: "templates/unit/new.html",
        controller: "UnitNew",
        keepdata: true
    })
    .state("unitlist", {
        url: "/unit/list",
        templateUrl: "templates/unit/list.html",
        controller: "UnitList"
    })
    .state("unitshow", {
        url: "/unit/:id",
        templateUrl: "templates/unit/show.html",
        controller: "UnitShow"
    })
    //Item Routes
    .state("itemnew", {
        url: "/item/new",
        templateUrl: "templates/item/new.html",
        controller: "ItemNew",
        keepdata: true
    })
    .state("itemlist", {
        url: "/item/list",
        templateUrl: "templates/item/list.html",
        controller: "ItemList"
    })
    .state("itemshow", {
        url: "/item/:id",
        templateUrl: "templates/item/show.html",
        controller: "ItemShow"
    })
    //Entity Routes
    .state("entitynew", {
        url: "/entity/new",
        templateUrl: "templates/entity/new.html",
        controller: "EntityNew",
        keepdata: true
    })
    .state("entitylist", {
        url: "/entity/list",
        templateUrl: "templates/entity/list.html",
        controller: "EntityList"
    })
    .state("entityshow", {
        url: "/entity/:id",
        templateUrl: "templates/entity/show.html",
        controller: "EntityShow"
    })
    //Country Routes
    .state("countrynew", {
        url: "/country/new",
        templateUrl: "templates/country/new.html",
        controller: "CountryNew",
        keepdata: true
    })
    .state("countrylist", {
        url: "/country/list",
        templateUrl: "templates/country/list.html",
        controller: "CountryList"
    })
    .state("countryshow", {
        url: "/country/:id",
        templateUrl: "templates/country/show.html",
        controller: "CountryShow"
    })
        // resolve: {
        //     auth: ['UserSession', function(UserSession) {
        //         return UserSession.getAuth();
        //     }]
        // }
    
    // .state("userlogin", {
    //  url: "/user/login",
    //  templateUrl: "templates/user/user.login.html",
   //      controller: "UserLogin"
    // })
    
}]);