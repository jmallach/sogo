!function(){"use strict";function a(b){if("function"!=typeof b.then)if(this.init(b),this.name&&!this.id){var c=a.$$resource.create("createFolder",this.name);this.$unwrap(c),this.acls={objectEditor:1,objectCreator:1,objectEraser:1}}else this.id&&(this.$acl=new a.$$Acl("Contacts/"+this.id));else this.$unwrap(b)}a.$factory=["$q","$timeout","$log","sgSettings","Resource","Card","Acl","Preferences",function(b,c,d,e,f,g,h,i){return angular.extend(a,{$q:b,$timeout:c,$log:d,$$resource:new f(e.activeUser("folderURL")+"Contacts",e.activeUser()),$Card:g,$$Acl:h,$Preferences:i,$query:{search:"name_or_address",value:"",sort:"c_cn",asc:1},activeUser:e.activeUser(),selectedFolder:null,$refreshTimeout:null}),i.ready().then(function(){i.settings.Contact.SortingState&&(a.$query.sort=i.settings.Contact.SortingState[0],a.$query.asc=parseInt(i.settings.Contact.SortingState[1]))}),a}];try{angular.module("SOGo.ContactsUI")}catch(b){angular.module("SOGo.ContactsUI",["SOGo.Common","SOGo.PreferencesUI"])}angular.module("SOGo.ContactsUI").factory("AddressBook",a.$factory),a.$filterAll=function(b,c,d){var e={search:b};return b?(angular.isUndefined(a.$cards)&&(a.$cards=[]),angular.extend(e,c),a.$$resource.fetch(null,"allContactSearch",e).then(function(c){var e,f,g,h=function(a){return this.id==a.id};for(e=d?_.filter(c.contacts,function(a){return _.isUndefined(_.find(d,h,a))}):c.contacts,g=a.$cards.length-1;g>=0;g--)f=a.$cards[g],_.isUndefined(_.find(e,h,f))&&a.$cards.splice(g,1);return _.each(e,function(c,d){if(_.isUndefined(_.find(a.$cards,h,c))){var e=new a.$Card(c,b);a.$cards.splice(d,0,e)}}),a.$log.debug(a.$cards),a.$cards})):(a.$cards=[],a.$q.when(a.$cards))},a.$add=function(a){var b,c,d;b=a.isSubscription?this.$subscriptions:this.$addressbooks,c=_.find(b,function(b){return"personal"==a.id||"personal"!=b.id&&1===b.name.localeCompare(a.name)}),d=c?_.indexOf(_.pluck(b,"id"),c.id):1,b.splice(d,0,a)},a.$findAll=function(b){var c=this;return b&&(this.$addressbooks=[],this.$subscriptions=[],this.$remotes=[],angular.forEach(b,function(b,d){var e=new a(b);e.isRemote?c.$remotes.push(e):e.isSubscription?c.$subscriptions.push(e):c.$addressbooks.push(e)})),_.union(this.$addressbooks,this.$subscriptions,this.$remotes)},a.$find=function(b){var c=a.$Preferences.ready().then(function(){return a.$$resource.fetch(b,"view",a.$query)});return new a(c)},a.$subscribe=function(b,c){var d=this;return a.$$resource.userResource(b).fetch(c,"subscribe").then(function(b){var c=new a(b);return _.isUndefined(_.find(d.$subscriptions,function(a){return a.id==b.id}))&&a.$add(c),c})},a.prototype.init=function(b,c){this.$cards||(this.$isLoading=!0,this.$cards=[],this.cards=[]),angular.extend(this,b),this.isOwned=a.activeUser.isSuperUser||this.owner==a.activeUser.login,this.isSubscription=!this.isRemote&&this.owner!=a.activeUser.login},a.prototype.$id=function(){return this.id?a.$q.when(this.id):this.$futureAddressBookData.then(function(a){return a.id})},a.prototype.isSelectedCard=function(a){return this.selectedCard==a},a.prototype.$selectedCount=function(){var a;return a=0,this.cards&&(a=_.filter(this.cards,function(a){return a.selected}).length),a},a.prototype.$startRefreshTimeout=function(){var b=this;a.$refreshTimeout&&a.$timeout.cancel(a.$refreshTimeout),a.$Preferences.ready().then(function(){var c=a.$Preferences.defaults.SOGoRefreshViewCheck;if(c&&"manually"!=c){var d=angular.bind(b,a.prototype.$reload);a.$refreshTimeout=a.$timeout(d,1e3*c.timeInterval())}})},a.prototype.$reload=function(){return this.$startRefreshTimeout(),this.$filter()},a.prototype.$filter=function(b,c,d){var e,f=this;return c&&c.dry?c.dry&&(e=angular.copy(a.$query)):(this.$isLoading=!0,e=a.$query),a.$Preferences.ready().then(function(){return c&&(angular.extend(e,c),c.dry&&!b)?(f.$cards=[],a.$q.when(f.$cards)):(angular.isDefined(b)&&(e.value=b),f.$id().then(function(b){return a.$$resource.fetch(b,"view",e)}).then(function(e){var g,h,i,j,k=function(a){return f.id==a.id};for(h=c&&c.dry?f.$cards:f.cards,g=d?_.filter(e.cards,function(a){return _.isUndefined(_.find(d,k,a))}):e.cards,j=h.length-1;j>=0;j--)i=h[j],_.isUndefined(_.find(g,k,i))&&h.splice(j,1);return _.each(g,function(c,d){if(_.isUndefined(_.find(h,k,c))){var e=new a.$Card(c,b);h.splice(d,0,e)}}),_.each(g,function(a,b){var c,d;h[b].id!=a.id&&(c=_.findIndex(h,k,a),d=h.splice(c,1),h.splice(b,0,d[0]))}),f.$isLoading=!1,h}))})},a.prototype.$rename=function(b){var c=_.indexOf(_.pluck(a.$addressbooks,"id"),this.id);return this.name=b,a.$addressbooks.splice(c,1),a.$add(this),this.$save()},a.prototype.$delete=function(){var b,c,d=this,e=a.$q.defer();return this.isSubscription?(c=a.$$resource.fetch(this.id,"unsubscribe"),b=a.$subscriptions):(c=a.$$resource.remove(this.id),b=a.$addressbooks),c.then(function(){var a=_.indexOf(_.pluck(b,"id"),d.id);b.splice(a,1),e.resolve()},e.reject),e.promise},a.prototype.$deleteCards=function(b){var c=_.map(b,function(a){return a.id}),d=this;return a.$$resource.post(this.id,"batchDelete",{uids:c}).then(function(){d.cards=_.difference(d.cards,b)})},a.prototype.$copyCards=function(b,c){var d=_.map(b,function(a){return a.id});return a.$$resource.post(this.id,"copy",{uids:d,folder:c})},a.prototype.$save=function(){return a.$$resource.save(this.id,this.$omit()).then(function(a){return a})},a.prototype.$getCard=function(b){var c=this;return this.$id().then(function(d){var e,f=_.find(c.cards,function(a){return b==a.id});return f&&f.$futureCardData?f:(e=a.$Card.$find(d,b),e.$id().then(function(a){f&&angular.extend(f,e)}),e)})},a.prototype.$unwrap=function(b){var c=this;this.$futureAddressBookData=b.then(function(b){return a.$timeout(function(){return angular.forEach(a.$findAll(),function(a,d){a.id==b.id&&angular.extend(c,a)}),c.init(b),angular.forEach(c.cards,function(b,d){c.cards[d]=new a.$Card(b)}),c.$acl=new a.$$Acl("Contacts/"+c.id),c.$startRefreshTimeout(),c.$isLoading=!1,c})},function(b){c.isError=!0,angular.isObject(b)&&a.$timeout(function(){angular.extend(c,b)})})},a.prototype.$omit=function(){var a={};return angular.forEach(this,function(b,c){"constructor"!=c&&"cards"!=c&&"$"!=c[0]&&(a[c]=b)}),a}}(),function(){"use strict";function a(b,c){if("function"!=typeof b.then){if(this.init(b,c),this.pid&&!this.id){var d=a.$$resource.newguid(this.pid);this.$unwrap(d),this.isNew=!0}}else this.$unwrap(b)}a.$TEL_TYPES=["work","home","cell","fax","pager"],a.$EMAIL_TYPES=["work","home","pref"],a.$URL_TYPES=["work","home","pref"],a.$ADDRESS_TYPES=["work","home"],a.$factory=["$timeout","sgSettings","Resource","Preferences","Gravatar",function(b,c,d,e,f){return angular.extend(a,{$$resource:new d(c.activeUser("folderURL")+"Contacts",c.activeUser()),$timeout:b,$gravatar:f,$Preferences:e}),e.ready().then(function(){e.defaults.SOGoContactsCategories&&(a.$categories=e.defaults.SOGoContactsCategories),e.defaults.SOGoAlternateAvatar&&(a.$alternateAvatar=e.defaults.SOGoAlternateAvatar)}),a}];try{angular.module("SOGo.ContactsUI")}catch(b){angular.module("SOGo.ContactsUI",["SOGo.Common","SOGo.PreferencesUI"])}angular.module("SOGo.ContactsUI").factory("Card",a.$factory),a.$find=function(b,c){var d=this.$$resource.fetch([b,c].join("/"),"view");return c?new a(d):a.$unwrapCollection(d)},a.filterCategories=function(b){var c=new RegExp(b,"i");return _.map(_.filter(a.$categories,function(a){return-1!=a.search(c)}),function(a){return{value:a}})},a.$unwrapCollection=function(b){var c={};return c.$futureCardData=b,b.then(function(b){a.$timeout(function(){angular.forEach(b,function(b,d){c[b.id]=new a(b)})})}),c},a.prototype.init=function(b,c){this.refs=[],this.categories=[],angular.extend(this,b),this.$$fullname||(this.$$fullname=this.$fullname()),this.$$email||(this.$$email=this.$preferredEmail(c)),this.$$image||(this.$$image=this.image||a.$gravatar(this.$preferredEmail(c),32,a.$alternateAvatar,{no_404:!0})),this.selected=!1,this.empty=" "},a.prototype.$id=function(){return this.$futureCardData.then(function(a){return a.id})},a.prototype.$save=function(){var b=this,c="saveAsContact";return"vlist"==this.c_component&&(c="saveAsList"),a.$$resource.save([this.pid,this.id||"_new_"].join("/"),this.$omit(),{action:c}).then(function(c){return b.birthday&&(b.$birthday=a.$Preferences.$mdDateLocaleProvider.formatDate(b.birthday)),b.$shadowData=b.$omit(!0),c})},a.prototype.$delete=function(b,c){return b?void(c>-1&&this[b].length>c?this[b].splice(c,1):delete this[b]):a.$$resource.remove([this.pid,this.id].join("/"))},a.prototype.$fullname=function(){var a,b=this.c_cn||"";return 0===b.length&&(a=[],this.c_givenname&&this.c_givenname.length>0&&a.push(this.c_givenname),this.nickname&&this.nickname.length>0&&a.push("<em>"+this.nickname+"</em>"),this.c_sn&&this.c_sn.length>0&&a.push(this.c_sn),a.length>0?b=a.join(" "):this.c_org&&this.c_org.length>0?b=this.c_org:this.emails&&this.emails.length>0?b=_.find(this.emails,function(a){return""!==a.value}).value:this.c_cn&&this.c_cn.length>0&&(b=this.c_cn)),b},a.prototype.$description=function(){var a=[];return this.title&&a.push(this.title),this.role&&a.push(this.role),this.orgUnits&&this.orgUnits.length>0&&_.forEach(this.orgUnits,function(b){""!==b.value&&a.push(b.value)}),this.c_org&&a.push(this.c_org),this.description&&a.push(this.description),a.join(", ")},a.prototype.$preferredEmail=function(a){var b,c;return a&&(c=new RegExp(a,"i"),b=_.find(this.emails,function(a){return c.test(a.value)})),b?b=b.value:(b=_.find(this.emails,function(a){return"pref"==a.type}),b=b?b.value:this.emails&&this.emails.length?this.emails[0].value:""),b},a.prototype.$shortFormat=function(a){var b=[this.$$fullname],c=this.$preferredEmail(a);return c&&c!=this.$$fullname&&b.push(" <"+c+">"),b.join(" ")},a.prototype.$isCard=function(){return"vcard"==this.c_component},a.prototype.$isList=function(){return"vlist"==this.c_component},a.prototype.$addOrgUnit=function(a){if(angular.isUndefined(this.orgUnits))this.orgUnits=[{value:a}];else{for(var b=0;b<this.orgUnits.length&&this.orgUnits[b].value!=a;b++);b==this.orgUnits.length&&this.orgUnits.push({value:a})}return this.orgUnits.length-1},a.prototype.$addEmail=function(a){return angular.isUndefined(this.emails)?this.emails=[{type:a,value:""}]:_.isUndefined(_.find(this.emails,function(a){return""===a.value}))&&this.emails.push({type:a,value:""}),this.emails.length-1},a.prototype.$addScreenName=function(a){this.c_screenname=a},a.prototype.$addPhone=function(a){return angular.isUndefined(this.phones)?this.phones=[{type:a,value:""}]:_.isUndefined(_.find(this.phones,function(a){return""===a.value}))&&this.phones.push({type:a,value:""}),this.phones.length-1},a.prototype.$addUrl=function(a,b){return angular.isUndefined(this.urls)?this.urls=[{type:a,value:b}]:_.isUndefined(_.find(this.urls,function(a){return a.value==b}))&&this.urls.push({type:a,value:b}),this.urls.length-1},a.prototype.$addAddress=function(a,b,c,d,e,f,g,h){return angular.isUndefined(this.addresses)?this.addresses=[{type:a,postoffice:b,street:c,street2:d,locality:e,region:f,country:g,postalcode:h}]:_.find(this.addresses,function(a){return a.street==c&&a.street2==d&&a.locality==e&&a.country==g&&a.postalcode==h})||this.addresses.push({type:a,postoffice:b,street:c,street2:d,locality:e,region:f,country:g,postalcode:h}),this.addresses.length-1},a.prototype.$addMember=function(b){var c,d=new a({email:b,emails:[{value:b}]});if(angular.isUndefined(this.refs))this.refs=[d];else if(0===b.length)this.refs.push(d);else{for(c=0;c<this.refs.length&&this.refs[c].email!=b;c++);c==this.refs.length&&this.refs.push(d)}return this.refs.length-1},a.prototype.$reset=function(){var b=this;angular.forEach(this,function(a,c){"constructor"!=c&&"$"!=c[0]&&delete b[c]}),angular.extend(this,this.$shadowData),angular.forEach(this.refs,function(c,d){c.email&&(c.emails=[{value:c.email}]),b.refs[d]=new a(c)}),this.$shadowData=this.$omit(!0)},a.prototype.$unwrap=function(b){var c=this;this.$futureCardData=b.then(function(b){return c.init(b),angular.forEach(c.refs,function(b,d){b.email&&(b.emails=[{value:b.email}]),b.id=b.reference,c.refs[d]=new a(b)}),c.birthday&&(c.birthday=new Date(1e3*c.birthday),c.$birthday=a.$Preferences.$mdDateLocaleProvider.formatDate(c.birthday)),c.$shadowData=c.$omit(!0),c})},a.prototype.$omit=function(a){var b={};return angular.forEach(this,function(c,d){"refs"==d?b.refs=_.map(c,function(b){return b.$omit(a)}):"constructor"!=d&&"$"!=d[0]&&(a?b[d]=angular.copy(c):b[d]=c)}),a||(b.birthday?b.birthday=b.birthday.getTime()/1e3:b.birthday=0),b},a.prototype.toString=function(){var a=this.id+" "+this.$$fullname;return this.$$email&&(a+=" <"+this.$$email+">"),"["+a+"]"}}();
//# sourceMappingURL=Contacts.services.js.map