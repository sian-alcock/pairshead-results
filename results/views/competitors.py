import os
import requests
from rest_framework.views import APIView
from rest_framework.response import Response


from .serializers import CompetitorSerializer

from .models import Competitor

class CompetitorDataImport(APIView):

    def get(self, _request):
        # Start by deleting all existing competitors
        Competitor.objects.all().delete()

        Meeting = os.getenv("MEETING2019") # Competition Meeting API from the Information --> API Key menu
        UserAPI = os.getenv("USERAPI") # As supplied in email
        UserAuth = os.getenv("USERAUTH") # As supplied in email

        header = {'Authorization':UserAuth}
        request = {'api_key':UserAPI, 'meetingIdentifier':Meeting}
        url = 'https://webapi.britishrowing.org/api/OE2CrewInformation' # change ENDPOINTNAME for the needed endpoint eg OE2MeetingSetup

        r = requests.post(url, json=request, headers=header)
        if r.status_code == 200:
            # pprint(r.json())

            for competitor in r.json()['competitors']:

                data = {
                    'last_name': competitor['surname'],
                    'gender': competitor['gender'],
                    'crew': competitor['crewId'],
                }

                serializer = CompetitorSerializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            competitors = Competitor.objects.all()
            serializer = CompetitorSerializer(competitors, many=True)
            return Response(serializer.data)

        return Response(status=400)
