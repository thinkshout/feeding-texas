module Jekyll
  module DividedBy
    def divide(nums)
      num1 = nums[0].to_f
      num2 = nums[1].to_f
      val = num1/num2
      # val *= 100
      # return val.to_s
      # return '%.2f' % val
      # return val
      puts val
      # puts val.is_a?(String)
      # return 0.36
    end
  end
end
Liquid::Template.register_filter(Jekyll::DividedBy)