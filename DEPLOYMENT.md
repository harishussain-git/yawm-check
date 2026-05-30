# Deployment Notes

## OneSignal Web Push

Set these environment variables in Vercel:

- `NEXT_PUBLIC_ONESIGNAL_APP_ID`
- `ONESIGNAL_APP_ID`
- `ONESIGNAL_REST_API_KEY`

`NEXT_PUBLIC_ONESIGNAL_APP_ID` is required for the client reminder button.
`ONESIGNAL_REST_API_KEY` must stay server-only. Do not expose it in client code.
