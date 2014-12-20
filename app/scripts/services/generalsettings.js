'use strict';

angular.module('trelloGanttApp.common', [])
.factory('generalSettings', function () {
	var _members = null;
	var _organizations = null;

	return {
		/*MEMBER SETTINGS*/
		setMemberCache: function(members){
			_members = members;
		},
		getMemberCache: function(memberID){
			if(memberID === undefined){
				return _members;
			}
			else{
				for (var i = _members.length - 1; i >= 0; i--) {
					var m = _members[i];
					if(m.id === memberID)
						return m;
				}
			}
		},
		/*ORGANIZATION SETTINGS*/
		setOrganizationCache: function(organizations){
			_organizations = organizations;
		},
		getOrganizationCache: function(organizationID){
			if(organizationID === undefined){
				return _organizations;
			}
			else{
				for (var i = _organizations.length - 1; i >= 0; i--) {
					var m = _organizations[i];
					if(m.id === organizationID)
						return m;
				}
			}
		}
	};
});
