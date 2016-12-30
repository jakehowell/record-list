"use strict";
var ApiMap = (function () {
    function ApiMap() {
        this.access_group_types = { model: 'AccessGroupTypes', url: '/access_group_types', singular: 'access_group_type' };
        this.access_groups = { model: 'AccessGroups', url: '/access_groups', singular: 'access_group' };
        this.access_groups_assets = { model: 'AccessGroupsAssets', url: '/access_groups_assets', singular: 'access_groups_asset' };
        this.access_groups_features = { model: 'AccessGroupsFeatures', url: '/access_groups_features', singular: 'access_groups_feature' };
        this.access_groups_markets = { model: 'AccessGroupsMarkets', url: '/access_groups_markets', singular: 'access_groups_market' };
        this.access_groups_users = { model: 'AccessGroupsUsers', url: '/access_groups_users', singular: 'access_groups_user' };
        this.admins = { model: 'Admins', url: '/admins', singular: 'admin' };
        this.api_keys = { model: 'ApiKeys', url: '/api_keys', singular: 'api_key' };
        this.asset_details = { model: 'AssetDetails', url: '/asset_details', singular: 'asset_detail' };
        this.asset_tags = { model: 'AssetTags', url: '/asset_tags', singular: 'asset_tag' };
        this.assets = { model: 'Assets', url: '/assets', singular: 'asset' };
        this.assets_asset_tags = { model: 'AssetsAssetTags', url: '/assets_asset_tags', singular: 'assets_asset_tag' };
        this.campaign_themes = { model: 'CampaignThemes', url: '/campaign_themes', singular: 'campaign_theme' };
        this.campaign_user_domains = { model: 'CampaignUserDomains', url: '/campaign_user_domains', singular: 'campaign_user_domain' };
        this.campaign_user_hosts = { model: 'CampaignUserHosts', url: '/campaign_user_hosts', singular: 'campaign_user_host' };
        this.campaigns = { model: 'Campaigns', url: '/campaigns', singular: 'campaign' };
        this.clients = { model: 'Clients', url: '/clients', singular: 'client' };
        this.contact_activities = { model: 'ContactActivities', url: '/contact_activities', singular: 'contact_activity' };
        this.contacts = { model: 'Contacts', url: '/contacts', singular: 'contact' };
        this.countries = { model: 'Countries', url: '/coutries', singular: 'country' };
        this.device_tokens = { model: 'DeviceTokens', url: '/device_tokens', singular: 'device_token' };
        this.domain_registrars = { model: 'DomainRegistrars', url: '/domain_registrars', singular: 'domain_registrar' };
        this.domains = { model: 'Domains', url: '/domains', singular: 'domain' };
        this.feature_types = { model: 'FeatureTypes', url: '/feature_types', singular: 'feature_type' };
        this.features = { model: 'Features', url: '/features', singular: 'feature' };
        this.languages = { model: 'Languages', url: '/languages', singular: 'language' };
        this.localizations = { model: 'Localizations', url: '/localizations', singular: 'localization' };
        this.log_api_access = { model: 'LogApiAccess', url: '/log_api_access', singular: 'log_api_access' };
        this.markets = { model: 'Markets', url: '/markets', singular: 'market' };
        this.message_queues = { model: 'MessageQueues', url: '/message_queues', singular: 'message_queue' };
        this.message_tests = { model: 'MessageTests', url: '/message_tests', singular: 'message_test' };
        this.messages = { model: 'Messages', url: '/messages', singular: 'message' };
        this.notifications = { model: 'Notifications', url: '/notifications', singular: 'notification' };
        this.notification_types = { model: 'NotificationTypes', url: '/notification_types', singular: 'notification_type' };
        this.notification_users = { model: 'NotificationUsers', url: '/notification_users', singular: 'notification_user' };
        this.preference_keys = { model: 'PreferenceKeys', url: '/preference_keys', singular: 'preference_key' };
        this.preference_values = { model: 'PreferenceValues', url: '/preference_values', singular: 'preference_value' };
        this.preferences = { model: 'Preferences', url: '/preferences', singular: 'preference' };
        this.project_themes = { model: 'ProjectThemes', url: '/project_themes', singular: 'project_theme' };
        this.projects = { model: 'Projects', url: '/projects', singular: 'project' };
        this.prospecting_links = { model: 'ProspectingLinks', url: '/prospecting_links', singular: 'prospecting_link' };
        this.role_permissions = { model: 'RolePermissions', url: '/role_permissions', singular: 'role_permission' };
        this.roles = { model: 'Roles', url: '/roles', singular: 'role' };
        this.social_apps = { model: 'SocialApps', url: '/social_apps', singular: 'social_app' };
        this.social_network_usernames = { model: 'SocialNetworkUsernames', url: '/social_network_usernames', singular: 'social_network_username' };
        this.social_networks = { model: 'SocialNetworks', url: '/social_networks', singular: 'social_network' };
        this.translation_hashes = { model: 'TranslationHashes', url: '/translation_hashes', singular: 'translation_hash' };
        this.translation_strings = { model: 'TranslationStrings', url: '/translation_strings', singular: 'translation_string' };
        this.translation_tags = { model: 'TranslationTags', url: '/translation_tags', singular: 'translation_tags' };
        this.translation_tokens = { model: 'TranslationTokens', url: '/translation_tokens', singular: 'translation_tokens' };
        this.translation_tokens_translation_tags = { model: 'TranslationTokensTranslationTags', url: '/translation_tokens_translation_tags', singular: 'translation_tokens_transaltion_tag' };
        this.user_activities = { model: 'UserActivities', url: '/user_activities', singular: 'user_activity' };
        this.user_addresses = { model: 'UserAddresses', url: '/user_addresses', singular: 'user_addres' };
        this.user_localization_contents = { model: 'UserLocalizationContents', url: '/user_localization_contents', singular: 'user_localization_content' };
        this.user_notes = { model: 'UserNotes', url: '/user_notes', singular: 'user_note' };
        this.user_profiles = { model: 'UserProfiles', url: '/user_profiles', singular: 'user_profile' };
        this.users = { model: 'Users', url: '/users', singular: 'user' };
    }
    return ApiMap;
}());
exports.ApiMap = ApiMap;
//# sourceMappingURL=api.map.js.map