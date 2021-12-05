from datetime import datetime, timezone, timedelta

# Time zone in Thailand UTC+7
tz = timezone(timedelta(hours = 7))

# Create a date object with given timezone
date = datetime.now(tz=tz)

# Reading infomation about time zone
print("Time zone offset: %s" % date.utcoffset())
print("Time zone name: %s" % date.tzname())

# Display time
print(date.isoformat(sep = " "))
print(date.ctime())
print(date.utcnow())