using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<double> numbers = new List<double>();

        while (true)
        {
            Console.Write("Nhap so: ");
            string input = Console.ReadLine();
            if (input.ToLower() == "ok")
            {
                break;
            }
            if (double.TryParse(input, out double number))
            {
                numbers.Add(number);
            }
            else
            {
                Console.WriteLine("err");
            }
        }

        Console.WriteLine("Nhap phep tinh:");
        string operation = Console.ReadLine().ToLower();
        double result = 0;

        if (numbers.Count == 0)
        {
            Console.WriteLine("err");
            return;
        }

        switch (operation)
        {
            case "+":
                foreach (double num in numbers)
                {
                    result += num;
                }
                break;
            case "-":
                result = numbers[0];
                for (int i = 1; i < numbers.Count; i++)
                {
                    result -= numbers[i];
                }
                break;
            case "*":
                result = 1;
                foreach (double num in numbers)
                {
                    result *= num;
                }
                break;
            case "/":
                result = numbers[0];
                for (int i = 1; i < numbers.Count; i++)
                {
                    if (numbers[i] == 0)
                    {
                        Console.WriteLine("err");
                        return;
                    }
                    result /= numbers[i];
                }
                break;
            default:
                Console.WriteLine("err");
                return;
        }

        // Hiển thị kết quả
        Console.WriteLine($"Ket qua: {result}");
    }
}
