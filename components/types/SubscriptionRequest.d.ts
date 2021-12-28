/*

api ref: https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/ pseudocode:


curl -X POST \
  'https://us20.api.mailchimp.com/3.0/lists/{list_id}/members?skip_merge_validation=TRUE' \
  --user "anystring:${apikey}"' \
  -d '{"email_address":"user@gmail.com","email_type":"","status":"subscribed","merge_fields":{"location": "-42.00000,-173.00000", "radius": "42", "frequency": "Daily"},"interests":{},"language":"","vip":false,"location":{"latitude":0,"longitude":0},"marketing_permissions":[],"ip_signup":"","timestamp_signup":"","ip_opt":"","timestamp_opt":"","tags":["nzcovidmap"]}'

*/

type SubscriptionRequest = {
    email_address: string
    email_type: string //email_type
    status: string //subscribed
    merge_fields: SubscriptionRequestFields
}

type SubscriptionRequestFields = {
    location: string // `${lat},${lng}`
    radius: string // kms
    frequency: string
    vip: boolean
    tags: string[]
}