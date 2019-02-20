Command to start the MapReduce services: `docker-compose up`

Example of request:

`POST localhost:1233/map-reduce`
```
{
	"mapper": "(el) => el.text.split(' ').map(word=> word.toLowerCase()).map(word => ({ key: word, value: 1 }))",
	"reducer": {
		"func": "(acc, prev) => prev + acc",
		"start": 0
	}
}
```

In `test.js` there is an example of using map reduce services in 'code level' using high level class.
