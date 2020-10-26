random-bridge-ea

chainlink external adapter which gets randomness from [drand.love](https://drand.love) and inserts on Tezos Blockchain every 30 seconds https://better-call.dev/carthagenet/KT1NH3FkrYZhM93BJtSSLfYwPKcqpiyjgVmE/operations

``` 
{
	"initiators": [
		{
			"type": "cron",
			"params": {
				"schedule": "CRON_TZ=UTC */30 * * * * *"
			}
		}
	],
	"tasks": [
		{
			"type": "random_bridge",
			"confirmations": null,
			"params": {}
		}
	],
	"startAt": null,
	"endAt": null
}
```
.env
```
TEZOS_NODE=
CONSEIL_SERVER=
API_KEY=
KT_ADDRESS=
NETWORK=
SECRET_KEY=
LAMBDA=true
```
you can generate your api keys on nautilus cloud
```
MIT License
```