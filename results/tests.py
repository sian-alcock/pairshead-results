from rest_framework.test import APITestCase
from django.urls import reverse
from .models import Crew, Club, Event


# Create your tests here.
class CrewTests(APITestCase):

    def setUp(self):
        crew = Crew.objects.create(name='Alcock-Powell', composite_code='ALP', rowing_CRI=99, rowing_CRI_max=999, sculling_CRI=9999, sculling_CRI_max=99999, status='Accepted', penalty=0, handicap=0, manual_override_time=0, bib_number=123, )
        club = Club.objects.create(name='My best rowing club', id=999999,)
        crew.club.set([club])
        event = Event.objects.create(name='Event99', id=999999,)
        crew.event.set([event])

    def test_crews_index(self):
        """
        Should return an array of crews
        """

        url = reverse('crews-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, [{
            'id': 1,
            'name': 'My best rowing club',
            'composite_code': 'ALP',
            'rowing_CRI': '99',
            'rowing_CRI_max': '999',
            'sculling_CRI': '9999',
            'sculling_CRI_max': '99999',
            'status': 'Accepted',
            'penalty': 0,
            'handicap': 0,
            'manual_override_time': 0,
            'bib_number': 123,
            'club': [{
                'id': 999999,
                'name': 'My best rowing club',
            }],
            'event': [{
                'id': 999999,
                'name': 'Event99',
            }],
        }])
