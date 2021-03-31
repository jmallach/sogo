!function(){"use strict";function e(e,t){e.state("app",{url:"/addressbooks",abstract:!0,views:{addressbooks:{templateUrl:"UIxContactFoldersView",controller:"AddressBooksController",controllerAs:"app"}},resolve:{stateAddressbooks:o}}).state("app.addressbook",{url:"/:addressbookId",views:{addressbook:{templateUrl:"addressbook",controller:"AddressBookController",controllerAs:"addressbook"}},resolve:{stateAddressbook:r}}).state("app.addressbook.new",{url:"/{contactType:(?:card|list)}/new",params:{refs:{array:!0}},views:{card:{templateUrl:"UIxContactEditorTemplate",controller:"CardController",controllerAs:"editor"}},resolve:{stateCard:s}}).state("app.addressbook.card",{url:"/:cardId",abstract:!0,views:{card:{template:"<ui-view/>"}},resolve:{stateCard:n},onEnter:d,onExit:a}).state("app.addressbook.card.view",{url:"/view",views:{"card@app.addressbook":{templateUrl:"UIxContactViewTemplate",controller:"CardController",controllerAs:"editor"}}}).state("app.addressbook.card.editor",{url:"/edit",views:{"card@app.addressbook":{templateUrl:"UIxContactEditorTemplate",controller:"CardController",controllerAs:"editor"}}}),t.rules.otherwise({state:"app.addressbook",params:{addressbookId:"personal"}})}function o(e){return e.$findAll(window.contactFolders)}function r(e,t,o,r){r=_.find(r.$findAll(),function(e){return e.id==o.addressbookId});return r?(delete r.selectedCard,r.$reload(),r):e.reject("Addressbook "+o.addressbookId+" not found")}function s(e,t,o){var r="v"+e.contactType,e=new o({pid:e.addressbookId,c_component:r,refs:e.refs});return t.selectedCard=!0,e}function n(t,o,r){return r.$futureAddressBookData.then(function(){var e=_.find(r.$cards,function(e){return e.id==o.cardId});if(e)return e.$reload();t.go("app.addressbook")})}function d(e,t){t.selectedCard=e.cardId}function a(e){delete r.selectedCard}function t(e,t,o,r){e.DebugEnabled||r.defaultErrorHandler(function(){}),o.onError({to:"app.**"},function(e){"app"==e.to().name||e.ignored()||(t.error("transition error to "+e.to().name+": "+e.error().detail),r.go("app.addressbook",{addressbookId:"personal"}))})}angular.module("SOGo.ContactsUI",["ngCookies","ui.router","angularFileUpload","sgCkeditor","SOGo.Common","SOGo.PreferencesUI","SOGo.MailerUI"]).config(e).run(t),e.$inject=["$stateProvider","$urlServiceProvider"],o.$inject=["AddressBook"],r.$inject=["$q","$state","$stateParams","AddressBook"],s.$inject=["$stateParams","stateAddressbook","Card"],n.$inject=["$state","$stateParams","stateAddressbook"],d.$inject=["$stateParams","stateAddressbook"],a.$inject=["stateAddressbook"],t.$inject=["$window","$log","$transitions","$state"]}(),function(){"use strict";function e(d,a,e,i,t,c,u,o,r,s,n,h,f,p,m,g){var $,k=this,b=[];function C(e){var t=k.selectedFolder.$selectedCardIndex();return angular.isDefined(t)?(t--,0<k.selectedFolder.$topIndex&&k.selectedFolder.$topIndex--):(t=k.selectedFolder.$cards.length()-1,k.selectedFolder.$topIndex=k.selectedFolder.getLength()),-1<t&&k.selectCard(k.selectedFolder.$cards[t]),e.preventDefault(),t}function v(e){var t=k.selectedFolder.$selectedCardIndex();return angular.isDefined(t)?(t++,k.selectedFolder.$topIndex<k.selectedFolder.$cards.length&&k.selectedFolder.$topIndex++):t=0,t<k.selectedFolder.$cards.length?k.selectCard(k.selectedFolder.$cards[t]):t=-1,e.preventDefault(),t}function w(e){var t;k.selectedFolder.hasSelectedCard()&&0<=(t=C(e))&&toggleCardSelection(e,k.selectedFolder.$cards[t])}function y(e){var t;k.selectedFolder.hasSelectedCard()&&0<=(t=v(e))&&toggleCardSelection(e,k.selectedFolder.$cards[t])}function F(e,t){var o,r,s=k.selectedFolder,n=!1,d=s.$selectedCards(),a=_.filter(d,function(e){return e.$isCard()});a.length!=d.length&&u.show(u.simple().textContent(l("Lists can't be moved or copied.")).position("top right").hideDelay(2e3)),a.length&&("copy"==e?(o=s.$copyCards(a,t),r=l("%{0} card(s) copied",a.length)):(o=s.$moveCards(a,t),r=l("%{0} card(s) moved",a.length),a=_.map(a,"id"),n=s.selectedCard&&0<=a.indexOf(s.selectedCard)),o.then(function(){n&&i.go("app.addressbook"),u.show(u.simple().textContent(r).position("top right").hideDelay(2e3))}))}$={c_cn:"Name",c_sn:"Lastname",c_givenname:"Firstname",c_mail:"Email",c_screenname:"Screen Name",c_o:"Organization",c_telephonenumber:"Preferred Phone"},this.$onInit=function(){var t;s.selectedFolder=g,this.service=s,this.selectedFolder=g,this.mode={search:!1,multiple:0},(t=b).push(p.createHotkey({key:l("hotkey_search"),description:l("Search"),callback:angular.bind(k,k.searchMode)})),t.push(p.createHotkey({key:l("key_create_card"),description:l("Create a new address book card"),callback:angular.bind(k,k.newComponent,"card")})),t.push(p.createHotkey({key:l("key_create_list"),description:l("Create a new list"),callback:angular.bind(k,k.newComponent,"list")})),t.push(p.createHotkey({key:"space",description:l("Toggle item"),callback:angular.bind(k,k.toggleCardSelection)})),t.push(p.createHotkey({key:"shift+space",description:l("Toggle range of items"),callback:angular.bind(k,k.toggleCardSelection)})),t.push(p.createHotkey({key:"up",description:l("View next item"),callback:C})),t.push(p.createHotkey({key:"down",description:l("View previous item"),callback:v})),t.push(p.createHotkey({key:"shift+up",description:l("Add next item to selection"),callback:w})),t.push(p.createHotkey({key:"shift+down",description:l("Add previous item to selection"),callback:y})),_.forEach(["backspace","delete"],function(e){t.push(p.createHotkey({key:e,description:l("Delete selected card or address book"),callback:angular.bind(k,k.confirmDeleteSelectedCards)}))}),_.forEach(t,function(e){p.registerHotkey(e)}),d.$on("$destroy",function(){_.forEach(b,function(e){p.deregisterHotkey(e)})})},this.centerIsClose=function(e){return this.selectedFolder.hasSelectedCard()&&!!e},this.selectCard=function(e){i.go("app.addressbook.card.view",{cardId:e.id})},this.toggleCardSelection=function(e,t){var o,r,s,n=this.selectedFolder;if((t=t||n.$selectedCard()).selected=!t.selected,this.mode.multiple+=t.selected?1:-1,e.shiftKey&&1<n.$selectedCount()){for(r=(o=n.idsMap[t.id])-2;0<=r&&!n.$cards[r].selected;)r--;if(r<0)for(r=o+2;r<n.getLength()&&!n.$cards[r].selected;)r++;if(0<=r&&r<n.getLength())for(s=Math.min(o,r);s<=Math.max(o,r);s++)n.$cards[s].selected=!0}e.preventDefault(),e.stopPropagation()},this.newComponent=function(e){i.go("app.addressbook.new",{contactType:e})},this.unselectCards=function(){_.forEach(this.selectedFolder.$cards,function(e){e.selected=!1}),this.mode.multiple=0},this.confirmDeleteSelectedCards=function(e){var t=this.selectedFolder.$selectedCards();this.selectedFolder.acls.objectEraser&&0<_.size(t)&&h.confirm(l("Warning"),l("Are you sure you want to delete the selected contacts?"),{ok:l("Delete")}).then(function(){k.selectedFolder.$deleteCards(t).then(function(){k.mode.multiple=0,k.selectedFolder.selectedCard||i.go("app.addressbook")})}),e.preventDefault()},this.copySelectedCards=function(e){F("copy",e)},this.moveSelectedCards=function(e){F("move",e)},this.selectAll=function(){_.forEach(this.selectedFolder.$cards,function(e){e.selected=!0}),this.mode.multiple=this.selectedFolder.$cards.length},this.sort=function(e){if(!e)return $[s.$query.sort];this.selectedFolder.$filter("",{sort:e})},this.sortedBy=function(e){return s.$query.sort==e},this.ascending=function(){return s.$query.asc},this.searchMode=function(e){k.mode.search=!0,n("search"),e&&e.preventDefault()},this.cancelSearch=function(){this.mode.search=!1,this.selectedFolder.$filter("")},this.newMessage=function(r,s,n){o.$findAll().then(function(e){var t=_.find(e,function(e){if(0===e.id)return e}),o=a.defer();t.$getMailboxes().then(function(e){t.$newMessage().then(function(e){e.editable[n]=s,c.show({parent:angular.element(document.body),targetEvent:r,clickOutsideToClose:!1,escapeToClose:!1,templateUrl:"../Mail/UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor",onComplete:function(e,t){return o.resolve(t)},locals:{stateParent:d,stateAccount:t,stateMessage:e,onCompletePromise:function(){return o.promise}}})})})})},this.newMessageWithRecipient=function(e,t,o){this.newMessage(e,[o+" <"+t+">"],"to"),e.stopPropagation(),e.preventDefault()},this.newMessageWithSelectedCards=function(e,t){var o=_.filter(this.selectedFolder.$cards,function(e){return e.selected}),r=[],s=[];_.forEach(o,function(e){e.$isList({expandable:!0})?angular.isDefined(e.refs)&&e.refs.length?_.forEach(e.refs,function(e){e.email.length&&s.push(e.$shortFormat())}):r.push(e.$reload().then(function(e){_.forEach(e.refs,function(e){e.email.length&&s.push(e.$shortFormat())})})):e.c_mail.length&&s.push(e.$shortFormat())}),a.all(r).then(function(){(s=_.uniq(s)).length&&k.newMessage(e,s,t)})},this.newListWithSelectedCards=function(){var e=_.filter(this.selectedFolder.$cards,function(e){return e.selected}),t=[],o=[];_.forEach(e,function(e){e.$isList({expandable:!0})?angular.isDefined(e.refs)&&e.refs.length?_.forEach(e.refs,function(e){e.email.length&&o.push(e)}):t.push(e.$reload().then(function(e){_.forEach(e.refs,function(e){e.email.length&&o.push(e)})})):e.$$email&&e.$$email.length&&o.push(e)}),a.all(t).then(function(){(o=_.uniqBy(_.map(o,function(e){return{reference:e.id||e.reference,email:e.$$email||e.email}}),"reference")).length&&i.go("app.addressbook.new",{contactType:"list",refs:o})})}}e.$inject=["$scope","$q","$window","$state","$timeout","$mdDialog","$mdToast","Account","Card","AddressBook","sgFocus","Dialog","sgSettings","sgHotkeys","stateAddressbooks","stateAddressbook"],angular.module("SOGo.ContactsUI").controller("AddressBookController",e)}(),function(){"use strict";function e(o,i,e,t,r,s,n,d,c,a,u,h,f,p,m,g,$,k,b,C,v){var w=this,y=[];this.$onInit=function(){var t;this.activeUser=b.activeUser,this.service=$,this.saving=!1,t=y,_.forEach(["backspace","delete"],function(e){t.push(p.createHotkey({key:e,description:l("Delete selected card or address book"),callback:function(){$.selectedFolder&&!$.selectedFolder.hasSelectedCard()&&confirmDelete()}}))}),_.forEach(t,function(e){p.registerHotkey(e)})},this.$onDestroy=function(){_.forEach(y,function(e){p.deregisterHotkey(e)})},this.select=function(e,t){i.params.addressbookId!=t.id&&this.editMode!=t.id&&(this.editMode=!1,$.$query.value="",a(f["gt-md"])||u("left").close(),i.go("app.addressbook",{addressbookId:t.id}))},this.newAddressbook=function(){k.prompt(l("New Addressbook..."),l("Name of the Address Book")).then(function(e){var t=new $({name:e,isEditable:!0,isRemote:!1,owner:UserLogin});t.$id().then(function(){$.$add(t)}).catch(_.noop)})},this.edit=function(e){e.isRemote||(this.editMode=e.id,this.originalAddressbook=e.$omit(),m("addressBookName_"+e.id))},this.revertEditing=function(e){e.name=this.originalAddressbook.name,this.editMode=!1},this.save=function(e){var t=e.name;!this.saving&&t&&0<t.length?t!=this.originalAddressbook.name?(this.saving=!0,e.$rename(t).then(function(e){w.editMode=!1},function(){w.revertEditing(e),w.editMode=e.id}).finally(function(){w.saving=!1})):this.editMode=!1:this.revertEditing(e)},this.confirmDelete=function(){this.service.selectedFolder.isSubscription?this.service.selectedFolder.$delete().then(function(){w.service.selectedFolder=null,i.go("app.addressbook",{addressbookId:"personal"})},function(e,t){k.alert(l('An error occured while deleting the addressbook "%{0}".',w.service.selectedFolder.name),l(e.error))}):k.confirm(l("Warning"),l('Are you sure you want to delete the addressbook "%{0}"?',this.service.selectedFolder.name),{ok:l("Delete")}).then(function(){return w.service.selectedFolder.$delete()}).then(function(){return w.service.selectedFolder=null,i.go("app.addressbook",{addressbookId:"personal"}),!0}).catch(function(e){e&&(e=e.data.message||e.statusText,k.alert(l('An error occured while deleting the addressbook "%{0}".',w.service.selectedFolder.name),e))})},this.importCards=function(e,t){function o(e,n,t){function o(e){e=0===e.type.indexOf("text")||/\.(ldif|vcf|vcard)$/.test(e.name);return e||c.show({template:["<md-toast>",'  <div class="md-toast-content">','    <md-icon class="md-warn md-hue-1">error_outline</md-icon>',"    <span>"+l("Select a vCard or LDIF file.")+"</span>","  </div>","</md-toast>"].join(""),position:"top right",hideDelay:3e3}),e}this.uploader=new h({url:ApplicationBaseURL+[t.id,"import"].join("/"),autoUpload:!0,queueLimit:1,filters:[{name:o,fn:o}],onSuccessItem:function(e,t,o,r){var s;n.hide(),0===t.imported?s=l("No card was imported."):(s=l("A total of %{0} cards were imported in the addressbook.",t.imported),$.selectedFolder.$reload()),c.show(c.simple().textContent(s).position("top right").hideDelay(3e3))},onErrorItem:function(e,t,o,r){c.show({template:["<md-toast>",'  <div class="md-toast-content">','    <md-icon class="md-warn md-hue-1">error_outline</md-icon>',"    <span>"+l("An error occured while importing contacts.")+"</span>","  </div>","</md-toast>"].join(""),position:"top right",hideDelay:3e3})}}),this.close=function(){n.hide()}}d.show({parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,escapeToClose:!0,templateUrl:"UIxContactsImportDialog",controller:o,controllerAs:"$CardsImportDialogController",locals:{folder:t}}),o.$inject=["scope","$mdDialog","folder"]},this.showLinks=function(e){function t(e,t){this.addressbook=t,this.close=function(){e.hide()}}(e.urls?o.when():$.$reloadAll()).then(function(){d.show({parent:angular.element(document.body),clickOutsideToClose:!0,escapeToClose:!0,templateUrl:e.id+"/links",controller:t,controllerAs:"links",locals:{addressbook:e}})}),t.$inject=["$mdDialog","addressbook"]},this.showProperties=function(e){function t(e,t,o){var r=this;r.addressbook=new $(o.$omit()),r.saveProperties=function(){r.addressbook.$save().then(function(){o.init(r.addressbook.$omit()),t.hide()})},r.close=function(){t.cancel()}}d.show({templateUrl:e.id+"/properties",controller:t,controllerAs:"properties",clickOutsideToClose:!0,escapeToClose:!0,locals:{srcAddressBook:e}}).catch(function(){}),t.$inject=["$scope","$mdDialog","srcAddressBook"]},this.share=function(e){e.$acl.$users().then(function(){d.show({templateUrl:e.id+"/UIxAclEditor",controller:"AclController",controllerAs:"acl",clickOutsideToClose:!0,escapeToClose:!0,locals:{usersWithACL:e.$acl.users,User:C,folder:e}})})},this.subscribeToFolder=function(e){$.$subscribe(e.owner,e.name).then(function(e){c.show(c.simple().textContent(l("Successfully subscribed to address book")).position("top right").hideDelay(3e3))})},this.isDroppableFolder=function(e,t){return t.id!=e.id&&(t.isOwned||t.acls.objectCreator)},this.dragSelectedCards=function(e,t,o){var r,s,n=t.id,d=!1,a=e.$selectedCards();0===a.length&&(a=[e.$selectedCard()]),(t=_.filter(a,function(e){return e.$isCard()})).length!=a.length&&c.show(c.simple().textContent(l("Lists can't be moved or copied.")).position("top right").hideDelay(2e3)),t.length&&("copy"==o?(r=e.$copyCards(t,n),s=l("%{0} card(s) copied",t.length)):(r=e.$moveCards(t,n),s=l("%{0} card(s) moved",t.length),t=_.map(t,"id"),d=e.selectedCard&&0<=t.indexOf(e.selectedCard)),r.then(function(){d&&i.go("app.addressbook"),c.show(c.simple().textContent(s).position("top right").hideDelay(2e3))}))}}e.$inject=["$q","$state","$scope","$rootScope","$stateParams","$timeout","$window","$mdDialog","$mdToast","$mdMedia","$mdSidenav","FileUploader","sgConstant","sgHotkeys","sgFocus","Card","AddressBook","Dialog","sgSettings","User","stateAddressbooks"],angular.module("SOGo.ContactsUI").controller("AddressBooksController",e)}(),function(){"use strict";function e(e,t,o,r,s,n,d,a,i,c,u,h,f){var p,m=this,g=[];function $(){u.go("app.addressbook").then(function(){m.card=null,delete n.selectedFolder.selectedCard})}function k(){var o=f;a.confirm(l("Warning"),l("Are you sure you want to delete the card of %{0}?","<b>"+o.$fullname()+"</b>"),{ok:l("Delete")}).then(function(){n.selectedFolder.$deleteCards([o]).then(function(){$()},function(e,t){a.alert(l("Warning"),l('An error occured while deleting the card "%{0}".',o.$fullname()))})})}m.card=f,m.currentFolder=n.selectedFolder,m.allEmailTypes=d.$EMAIL_TYPES,m.allTelTypes=d.$TEL_TYPES,m.allUrlTypes=d.$URL_TYPES,m.allAddressTypes=d.$ADDRESS_TYPES,m.categories={},m.userFilterResults=[],m.transformCategory=function(e){return angular.isString(e)?{value:e}:e},m.removeAttribute=function(e,t,o){m.card.$delete(t,o),e.$setDirty()},m.addOrg=function(){var e=m.card.$addOrg({value:""});c("org_"+e)},m.addBirthday=function(){m.card.birthday=new Date},m.addScreenName=function(){m.card.$addScreenName("")},m.addEmail=function(){var e=m.card.$addEmail("");c("email_"+e)},m.addPhone=function(){var e=m.card.$addPhone("");c("phone_"+e)},m.addUrl=function(){var e=m.card.$addUrl("","https://www.fsf.org/");c("url_"+e)},m.addAddress=function(){var e=m.card.$addAddress("","","","","","","","");c("address_"+e)},m.canAddCustomField=function(){return _.keys(f.customFields).length<4},m.addCustomField=function(){angular.isDefined(m.card.customFields)||(m.card.customFields={});var e=_.pullAll(["1","2","3","4"],_.keys(f.customFields));m.card.customFields[e[0]]=""},m.deleteCustomField=function(e){delete m.card.customFields[e]},m.userFilter=function(e,t){return e.length<s.minimumSearchLength()?[]:n.selectedFolder.$filter(e,{dry:!0,excludeLists:!0},t).then(function(e){return e})},m.save=function(e){e.$valid&&m.card.$save().then(function(e){var t=_.indexOf(_.map(n.selectedFolder.$cards,"id"),m.card.id);t<0?n.selectedFolder.$reload():n.selectedFolder.$cards[t]=angular.copy(m.card),u.go("app.addressbook.card.view",{cardId:m.card.id})})},m.close=$,m.reset=function(e){m.card.$reset(),e.$setPristine()},m.cancel=function(){m.card.$reset(),m.card.isNew?(m.card=null,delete n.selectedFolder.selectedCard,u.go("app.addressbook",{addressbookId:n.selectedFolder.id})):u.go("app.addressbook.card.view",{cardId:m.card.id})},m.confirmDelete=k,m.toggleRawSource=function(e){m.showRawSource||m.rawSource?m.showRawSource=!m.showRawSource:d.$$resource.post(m.currentFolder.id+"/"+m.card.id,"raw").then(function(e){m.rawSource=e,m.showRawSource=!0})},m.showRawSource=!1,p=g,_.forEach(["backspace","delete"],function(e){p.push(i.createHotkey({key:e,description:l("Delete"),callback:function(e){m.currentFolder.acls.objectEraser&&0===m.currentFolder.$selectedCount()&&k(),e.preventDefault()}}))}),_.forEach(p,function(e){i.registerHotkey(e)}),m.card.hasCertificate&&m.card.$certificate().then(function(e){m.certificate=e},function(){delete m.card.hasCertificate}),e.$on("$destroy",function(){_.forEach(g,function(e){i.deregisterHotkey(e)})})}e.$inject=["$scope","$timeout","$window","$mdDialog","sgSettings","AddressBook","Card","Dialog","sgHotkeys","sgFocus","$state","$stateParams","stateCard"],angular.module("SOGo.ContactsUI").controller("CardController",e)}(),function(){"use strict";angular.module("SOGo.Common").directive("sgAddress",function(){return{restrict:"A",scope:{data:"=sgAddress"},controller:["$scope",function(e){e.addressLines=function(e){var t=[],o=[];return e.street&&t.push(e.street),e.street2&&t.push(e.street2),e.locality&&o.push(e.locality),e.region&&o.push(e.region),0<o.length&&t.push(o.join(", ")),e.country&&t.push(e.country),e.postalcode&&t.push(e.postalcode),t.join("<br>")}}],template:'<address ng-bind-html="addressLines(data)"></address>'}})}();
//# sourceMappingURL=Contacts.js.map