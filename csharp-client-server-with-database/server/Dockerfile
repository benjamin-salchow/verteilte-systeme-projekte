FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY CsharpClientServerWithDatabase.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY ./public ./public
EXPOSE 8080
ENTRYPOINT ["dotnet", "CsharpClientServerWithDatabase.dll"]
