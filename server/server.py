from flask import Flask
from flask_restful import Resource, Api
from flask_caching import Cache
import json
import urllib.request

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache", # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 5000
}

app = Flask(__name__)
app.config.from_mapping(config)
cache = Cache(app)
api = Api(app)

class Backend(Resource):
	def get(self):
		if cache.get('api') is None:
			f = urllib.request.urlopen("http://apis.data.go.kr/6260000/FoodService/getFoodKr?serviceKey=InnA5qZsV6BcZHVlnVGYrMQcSIGBmChok7DCVJGFFI%2BqdQ9FIlRZCyaZjVC57aAoiJFOHosw6SRCjn2%2BjznEHA%3D%3D&resultType=json&numOfRows=500")
			data = json.loads(f.read())
			cache.set('api', data)
		return cache.get('api'), 200, {'Access-Control-Allow-Origin': '*', 'charset': 'utf-8'}


api.add_resource(Backend, '/')
app.run(debug=True, port=8080)