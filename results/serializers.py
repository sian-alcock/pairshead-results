import re
from rest_framework import serializers
from .models import Club, Event, Crew, RaceTime


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'name', 'override_name', 'info', 'type', 'gender',)

class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ('id', 'name', 'abbreviation', 'index_code', 'colours', 'blade_image',)

class RaceTimesSerializer(serializers.ModelSerializer):

    class Meta:
        model = RaceTime
        fields = ('id', 'sequence', 'bib_number', 'tap', 'time_tap', 'crew',)

class CrewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Crew
        fields = ('id', 'name', 'composite_code', 'rowing_CRI', 'rowing_CRI_max', 'sculling_CRI', 'sculling_CRI_max', 'status', 'penalty', 'handicap', 'manual_override_minutes', 'manual_override_seconds', 'manual_override_hundredths_seconds', 'bib_number',)


class PopulatedCrewSerializer(serializers.ModelSerializer):

    club = ClubSerializer()
    event = EventSerializer()

    times = RaceTimesSerializer(many=True)
    raw_time = serializers.IntegerField()
    race_time = serializers.IntegerField()
    start_time = serializers.IntegerField()
    finish_time = serializers.IntegerField()
    start_sequence = serializers.IntegerField()
    finish_sequence = serializers.IntegerField()
    manual_override_time = serializers.IntegerField()

    class Meta:
        model = Crew
        fields = ('id', 'name', 'composite_code', 'rowing_CRI', 'rowing_CRI_max', 'sculling_CRI', 'sculling_CRI_max', 'status', 'penalty', 'handicap', 'manual_override_time', 'manual_override_minutes', 'manual_override_seconds', 'manual_override_hundredths_seconds', 'bib_number', 'times', 'raw_time', 'race_time', 'start_time', 'finish_time', 'start_sequence', 'finish_sequence', 'event', 'club',)


class WriteCrewSerializer(serializers.ModelSerializer):

    # club = serializers.CharField(max_length=20)
    # event = serializers.CharField(max_length=20)

    class Meta:
        model = Crew
        fields = ('id', 'name', 'composite_code', 'club', 'rowing_CRI', 'rowing_CRI_max', 'sculling_CRI', 'sculling_CRI_max', 'event', 'status', 'penalty', 'handicap', 'manual_override_minutes', 'manual_override_seconds', 'manual_override_hundredths_seconds',)

class WriteRaceTimesSerializer(serializers.ModelSerializer):

    time_tap = serializers.CharField(max_length=20)

    class Meta:
        model = RaceTime
        fields = ('id', 'sequence', 'bib_number', 'tap', 'time_tap', 'crew',)

    def validate_time_tap(self, value):
        # if time tap format is mm:ss.ms (eg 58:13.04), then add 0: at front
        if re.match(r'^[0-9]{2}:[0-9]{2}.[0-9]{2}', value):
            value = f'0:{value}'

        if not re.match(r'^[0-9]:[0-9]{2}:[0-9]{2}.[0-9]{2}', value):
            raise serializers.ValidationError({'time_tap': 'Problem with time tap format'})

        hrs, mins, secs = value.split(':')
        secs, hdths = secs.split('.')
        # convert to miliseconds
        value = int(hrs)*60*60*1000 + int(mins)*60*1000 + int(secs)*1000 + int(hdths)*10

        return value

class PopulatedRaceTimesSerializer(serializers.ModelSerializer):

    crew = CrewSerializer()

    class Meta:
        model = RaceTime
        fields = ('id', 'sequence', 'bib_number', 'tap', 'time_tap', 'crew',)


class WriteClubSerializer(serializers.ModelSerializer):

    # id = serializers.CharField(max_length=10)

    class Meta:
        model = Club
        fields = ('id', 'name', 'abbreviation', 'index_code', 'colours', 'blade_image',)

    def validate_id(self, value):

        if not isinstance(value, int):
            raise serializers.ValidationError({'id': 'Problem with ID'})

        return value
