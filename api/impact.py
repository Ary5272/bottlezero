from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json

PLASTIC_PER_BOTTLE_KG = 0.0127
CO2_PER_BOTTLE_KG = 0.083
COST_PER_BOTTLE_USD = 1.29
WATER_PER_BOTTLE_L = 0.5

CO2_PER_MILE_KG = 0.21
CO2_PER_PHONE_CHARGE_KG = 0.0084
CO2_PER_LED_HOUR_KG = 0.004
PLASTIC_BAG_KG = 0.0055


def compute_impact(bottles):
    bottles = max(0, int(bottles))
    plastic = bottles * PLASTIC_PER_BOTTLE_KG
    co2 = bottles * CO2_PER_BOTTLE_KG
    money = bottles * COST_PER_BOTTLE_USD
    water = bottles * WATER_PER_BOTTLE_L

    equivalents = [
        {"key": "car", "label": "miles not driven", "value": round(co2 / CO2_PER_MILE_KG, 1)},
        {"key": "phone", "label": "phone charges avoided", "value": round(co2 / CO2_PER_PHONE_CHARGE_KG)},
        {"key": "bulb", "label": "hours of LED light", "value": round(co2 / CO2_PER_LED_HOUR_KG)},
        {"key": "bag", "label": "plastic bags by weight", "value": round(plastic / PLASTIC_BAG_KG)},
    ]

    return {
        "bottles": bottles,
        "plastic_kg": round(plastic, 2),
        "co2_kg": round(co2, 2),
        "money_usd": round(money, 2),
        "water_l": round(water, 1),
        "equivalents": equivalents,
        "engine": "python",
    }


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            params = parse_qs(urlparse(self.path).query)
            bottles = float(params.get("bottles", ["0"])[0])
        except (ValueError, TypeError):
            bottles = 0

        body = json.dumps(compute_impact(bottles)).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "public, max-age=300")
        self.end_headers()
        self.wfile.write(body)
