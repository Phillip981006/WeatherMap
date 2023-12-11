using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Diagnostics;
using WeatherMap.Models;

namespace WeatherMap.Controllers
{
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;
		private IConfiguration _configuration;

		public HomeController(ILogger<HomeController> logger, IConfiguration config)
		{
			_logger = logger;
			_configuration = config;
		}

		public IActionResult Index()
		{
			return View();
		}

		public IActionResult Privacy()
		{
			return View();
		}


		#region YourRegionName
		// Your code goes here
		[HttpGet]
		[Route("/GetLocationData")]
		public async Task<IActionResult> GetWeatherData(string location)
		{
			try
			{

				using (var client = new HttpClient())
				{
					string ApiKey = _configuration.GetValue<string>("WeatherApiKey");


					var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.weatherapi.com/v1/current.json?key={ApiKey}&q={location}&aqi=no");
					var response = await client.SendAsync(request);
					response.EnsureSuccessStatusCode();

					var responseBody = await response.Content.ReadAsStringAsync();

					return Ok(
						new { 
							data = responseBody,
							responseMessage = "success"
					});
				}

			}catch (Exception ex)
			{
					return BadRequest(
						new {  
							data = "",
							responseMessage = ex.Message 
					});
			}
			
			

		}

		#endregion

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}