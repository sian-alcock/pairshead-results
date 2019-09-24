import csv
import os
import requests
from django.http import Http404, HttpResponse
# from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response

# from pprint import pprint

from .serializers import CrewSerializer, PopulatedCrewSerializer, WriteRaceTimesSerializer, RaceTimesSerializer, PopulatedRaceTimesSerializer, WriteCrewSerializer, WriteClubSerializer, ClubSerializer, EventSerializer
from .models import Club, Event, Crew, RaceTime

class ClubListView(APIView): # extend the APIView

    def get(self, _request):
        clubs = Club.objects.all() # get all the clubs
        serializer = ClubSerializer(clubs, many=True)

        return Response(serializer.data) # send the JSON to the client

class EventListView(APIView): # extend the APIView

    def get(self, _request):
        events = Event.objects.all() # get all the clubs
        serializer = EventSerializer(events, many=True)

        return Response(serializer.data) # send the JSON to the client

class RaceTimeListView(APIView): # extend the APIView

    def get(self, _request):
        race_times = RaceTime.objects.all() # get all the crews
        serializer = PopulatedRaceTimesSerializer(race_times, many=True)

        return Response(serializer.data) # send the JSON to the client

    def post(self, request):
        serializer = PopulatedRaceTimesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=422)


class RaceTimeDetailView(APIView):

    def get_race_time(self, pk):
        try:
            race_time = RaceTime.objects.get(pk=pk)
        except RaceTime.DoesNotExist:
            raise Http404
        return race_time

    def get(self, _request, pk):
        race_time = self.get_race_time(pk)
        serializer = PopulatedRaceTimesSerializer(race_time)
        return Response(serializer.data)

    def put(self, request, pk):
        race_time = self.get_race_time(pk)
        race_time = RaceTime.objects.get(pk=pk)
        serializer = RaceTimesSerializer(race_time, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=422)

    def delete(self, _request, pk):
        race_time = self.get_race_time(pk)
        race_time = RaceTime.objects.get(pk=pk)
        race_time.delete()
        return Response(status=204)

class CrewListView(APIView): # extend the APIView
    # pagination_class = LimitOffsetPagination

    def get(self, _request):
        crews = Crew.objects.filter(status__in=('Scratched', 'Accepted')) # get all the crews
        serializer = PopulatedCrewSerializer(crews, many=True)

        return Response(serializer.data) # send the JSON to the client

    def post(self, request):
        serializer = PopulatedCrewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=422)


class CrewDetailView(APIView): # extend the APIView

    def get_crew(self, pk):
        try:
            crew = Crew.objects.get(pk=pk)
        except Crew.DoesNotExist:
            raise Http404
        return crew

    def get(self, _request, pk):
        crew = self.get_crew(pk)
        serializer = PopulatedCrewSerializer(crew)
        return Response(serializer.data)

    def put(self, request, pk):
        crew = self.get_crew(pk)
        crew = Crew.objects.get(pk=pk)
        serializer = CrewSerializer(crew, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=422)

    def delete(self, _request, pk):
        crew = self.get_crew(pk)
        crew = Crew.objects.get(pk=pk)
        crew.delete()
        return Response(status=204)

class ClubDataImport(APIView):

    def get(self, _request):
        # Start by deleting all existing clubs
        Club.objects.all().delete()

        Meeting = os.getenv("MEETING2018") # Competition Meeting API
        UserAPI = os.getenv("USERAPI") # As supplied in email
        UserAuth = os.getenv("USERAUTH") # As supplied in email

        header = {'Authorization':UserAuth}
        request = {'api_key':UserAPI, 'meetingIdentifier':Meeting}
        url = 'https://webapi.britishrowing.org/api/OE2ClubInformation' # change ENDPOINTNAME for the needed endpoint eg OE2MeetingSetup

        r = requests.post(url, json=request, headers=header)
        if r.status_code == 200:
            # pprint(r.json())

            clubs = r.json()

            for club in clubs:
                data = {
                    'name': club['name'],
                    'id': club['id'],
                    'abbreviation': club['abbreviation'],
                    'index_code': club['indexCode'],
                    'colours': club['colours'],
                    'blade_image': club['bladeImage'],
                }
                serializer = WriteClubSerializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            clubs = Club.objects.all()
            serializer = ClubSerializer(clubs, many=True)
            return Response(serializer.data)

        return Response(status=400)

class EventDataImport(APIView):

    def get(self, _request):
        # Start by deleting all existing events
        Event.objects.all().delete()
        #
        # Event.objects.create('id'=999999, 'name'='Unknown', 'override_name'='Unknown',
        # 'info'='Unknown', 'type'='Unknown', 'gender'='Unknown',)

        Meeting = os.getenv("MEETING2018") # Competition Meeting API
        UserAPI = os.getenv("USERAPI") # As supplied in email
        UserAuth = os.getenv("USERAUTH") # As supplied in email

        header = {'Authorization':UserAuth}
        request = {'api_key':UserAPI, 'meetingIdentifier':Meeting}
        url = 'https://webapi.britishrowing.org/api/OE2MeetingSetup' # change ENDPOINTNAME for the needed endpoint eg OE2MeetingSetup

        r = requests.post(url, json=request, headers=header)
        if r.status_code == 200:
            # pprint(r.json())

            for event in r.json()['events']:
                data = {
                    'name': event['name'],
                    'id': event['id'],
                    'override_name': event['overrideName'],
                    'info': event['info'],
                    'type': event['type'],
                    'gender': event['gender'],
                }

                serializer = EventSerializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            events = Event.objects.all()
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data)

        return Response(status=400)

class CrewDataImport(APIView):

    def get(self, _request):
        # Start by deleting all existing crews and times
        Crew.objects.all().delete()
        RaceTime.objects.all().delete()

        Meeting = os.getenv("MEETING2018") # Competition Meeting API from the Information --> API Key menu
        UserAPI = os.getenv("USERAPI") # As supplied in email
        UserAuth = os.getenv("USERAUTH") # As supplied in email

        header = {'Authorization':UserAuth}
        request = {'api_key':UserAPI, 'meetingIdentifier':Meeting}
        url = 'https://webapi.britishrowing.org/api/OE2CrewInformation' # change ENDPOINTNAME for the needed endpoint eg OE2MeetingSetup

        r = requests.post(url, json=request, headers=header)
        if r.status_code == 200:
            # pprint(r.json())

            for crew in r.json()['crews']:

                data = {
                    'name': crew['name'],
                    'id': crew['id'],
                    'composite_code': crew['compositeCode'],
                    'club': crew['clubId'],
                    'rowing_CRI': crew['rowingCRI'],
                    'rowing_CRI_max': crew['rowingCRIMax'],
                    'sculling_CRI': crew['scullingCRI'],
                    'sculling_CRI_max': crew['scullingCRIMax'],
                    'event': crew['eventId'],
                    'status': crew['status'],
                }

                serializer = WriteCrewSerializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            crews = Crew.objects.all()
            serializer = WriteCrewSerializer(crews, many=True)
            return Response(serializer.data)

        return Response(status=400)


class CrewRaceTimesImport(APIView):
    # Start by deleting all existing times

    def get(self, _request):
        RaceTime.objects.all().delete()
        script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
        rel_path = "csv/race_times.csv"
        abs_file_path = os.path.join(script_dir, rel_path)

        with open(abs_file_path, newline='') as f:
            reader = csv.reader(f)
            next(reader) # skips the first row

            for row in reader:

                if row:
                    data = {
                        'sequence': row[0],
                        'bib_number': row[1] or None,
                        'tap': row[3] or None,
                        'time_tap': row[4],
                        'crew':row[8] or None
                    }
                    serializer = WriteRaceTimesSerializer(data=data)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

            race_times = RaceTime.objects.all()

            serializer = RaceTimesSerializer(race_times, many=True)
            return Response(serializer.data)


class CrewDataExport(APIView):

    def get(self, _request):

        crews = Crew.objects.all()
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="crewdata.csv"'

        writer = csv.writer(response, delimiter=',')
        writer.writerow(['name', 'id', 'composite_code', 'club', 'event',])

        for crew in crews:
            writer.writerow([crew.name, crew.id, crew.composite_code, crew.club.name, crew.event.name])

        return response

        # serializer = PopulatedCrewSerializer(crews, many=True)
        # return Response(serializer.data)
