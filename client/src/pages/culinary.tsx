import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Utensils,
  Soup,
  Coffee,
  History,
  Map,
  Youtube,
  ChefHat,
  ShoppingBag,
} from "lucide-react";

// Culinary data
const hueDishes = [
  {
    id: 1,
    name: "Bún bò Huế",
    nameEn: "Hue Beef Noodle Soup",
    description:
      "Món bún bò Huế là một trong những đặc sản nổi tiếng của xứ Huế. Nước dùng được nấu từ xương bò và giò heo trong nhiều giờ, kết hợp với sả, gừng và các gia vị đặc trưng của Huế.",
    descriptionEn:
      "Bun bo Hue is one of the most famous specialties of Hue. The broth is cooked from beef bones and pork knuckles for many hours, combined with lemongrass, ginger and Hue's characteristic spices.",
    image: "https://www.hungryhuy.com/wp-content/uploads/bun-bo-hue-bowl.jpg", // Updated image URL
    type: "main_dish",
    ingredients: [
      "Bún gạo",
      "Thịt bò",
      "Giò heo",
      "Sả",
      "Gừng",
      "Ớt",
      "Mắm ruốc",
    ],
    places: [
      {
        name: "Bún bò Bà Mỵ",
        address: "11 Lý Thường Kiệt, Phú Nhuận, Huế",
        rating: 4.8,
      },
      {
        name: "Bún bò Huế Huyền Anh",
        address: "3 Trương Định, Huế",
        rating: 4.7,
      },
    ],
    historicalContext:
      "Bún bò Huế xuất hiện từ thời nhà Nguyễn và ban đầu là món ăn trong cung đình.",
    preparation:
      "Nấu nước lèo từ xương bò, xương heo kết hợp với sả, hành tím, gừng, ớt và các loại gia vị đặc trưng. Sau đó thêm mắm ruốc Huế để tạo hương vị đặc biệt.",
    video: "https://www.youtube.com/watch?v=A_o2qfaTgKs",
  },
  {
    id: 2,
    name: "Bánh khoái",
    nameEn: "Hue Savory Pancake",
    description:
      "Bánh khoái là một món ăn đặc sản của Huế, gần giống với bánh xèo nhưng kích thước nhỏ hơn và cách chế biến cũng khác.",
    descriptionEn:
      "Bánh khoái is a specialty of Hue, similar to bánh xèo but smaller in size and prepared differently.",
    image:
      "https://th.bing.com/th/id/OIP._oW4gLImnEu-Nm2mkUmypAHaEK?rs=1&pid=ImgDetMain", // Updated image URL
    type: "appetizer",
    ingredients: ["Bột gạo", "Tôm", "Thịt heo", "Trứng", "Giá đỗ", "Hành lá"],
    places: [
      {
        name: "Bánh khoái Lạc Thiện",
        address: "6 Đinh Tiên Hoàng, Huế",
        rating: 4.6,
      },
      { name: "Bánh Khoái Hồng Mai", address: "65 Lê Lợi, Huế", rating: 4.5 },
    ],
    historicalContext:
      "Bánh khoái được cho là có nguồn gốc từ thời vua Minh Mạng, khi các đầu bếp cung đình chế biến để phục vụ hoàng gia.",
    preparation:
      "Bột gạo được trộn với trứng và nước, sau đó đổ vào chảo nóng. Thêm tôm, thịt heo, giá đỗ và hành lá lên trên. Bánh được ăn kèm với nước chấm đặc biệt làm từ gan heo xay nhuyễn, tương và đậu phộng.",
    video: "https://www.youtube.com/watch?v=yLZ9h-YoCeQ",
  },
  {
    id: 3,
    name: "Cơm hến",
    nameEn: "Clam Rice",
    description:
      "Cơm hến là món ăn dân dã đặc trưng của Huế, được làm từ cơm trộn với hến, rau thơm và nhiều gia vị.",
    descriptionEn:
      "Com hen is a rustic dish characteristic of Hue, made from rice mixed with baby clams, herbs and many spices.",
    image:
      "https://th.bing.com/th/id/OIP.poDw6pANcDBgB5v5uNJ_0AHaE8?rs=1&pid=ImgDetMain", // Updated image URL
    type: "main_dish",
    ingredients: [
      "Gạo",
      "Hến",
      "Rau thơm",
      "Lạc rang",
      "Bột chiên",
      "Mắm ruốc",
      "Ớt",
    ],
    places: [
      { name: "Cơm hến bà Vi", address: "17B Hàn Thuyên, Huế", rating: 4.7 },
      {
        name: "Quán Dì Sáu",
        address: "9 kiệt 42 Nguyễn Công Trứ, Huế",
        rating: 4.6,
      },
    ],
    historicalContext:
      "Cơm hến là món ăn của tầng lớp bình dân Huế, xuất hiện từ lâu đời khi người dân địa phương tận dụng nguồn hến dồi dào từ sông Hương.",
    preparation:
      "Hến được làm sạch, luộc chín và xé nhỏ. Cơm nguội trộn với hến, thêm các loại rau thơm, lạc rang, da heo chiên giòn, mắm ruốc và ớt tươi.",
    video: "https://www.youtube.com/watch?v=2Qm-Q7LJMO4",
  },
  {
    id: 4,
    name: "Bánh bèo",
    nameEn: "Water Fern Cake",
    description:
      "Bánh bèo là món bánh truyền thống của Huế, có hình dáng giống như lá bèo nổi trên mặt nước.",
    descriptionEn:
      "Banh beo is a traditional Hue cake, shaped like a water fern leaf floating on the water.",
    image:
      "https://th.bing.com/th/id/R.a82540505b01f87612926604065a979f?rik=SwEmw32v%2bsg%2f%2bw&pid=ImgRaw&r=0&sres=1&sresct=1", // Updated image URL
    type: "appetizer",
    ingredients: ["Bột gạo", "Tôm khô", "Mỡ hành", "Bột tôm", "Ớt", "Nước mắm"],
    places: [
      {
        name: "Bánh bèo Nậm Lộc",
        address: "11A Phó Đức Chính, Huế",
        rating: 4.8,
      },
      {
        name: "Bánh bèo O Thảo",
        address: "65 Huỳnh Thúc Kháng, Huế",
        rating: 4.7,
      },
    ],
    historicalContext:
      "Bánh bèo từng là món ăn trong cung đình Huế, được các đầu bếp hoàng gia chế biến tinh tế để phục vụ vua và hoàng tộc.",
    preparation:
      "Bột gạo được hòa với nước, đổ vào từng chiếc chén nhỏ và hấp chín. Bánh sau khi chín được rưới mỡ hành và rắc tôm khô lên trên. Ăn kèm với nước mắm chua ngọt và ớt.",
    video: "https://www.youtube.com/watch?v=B9hX0sCMv5w",
  },
  {
    id: 5,
    name: "Chè Huế",
    nameEn: "Hue Sweet Soup",
    description:
      "Chè Huế nổi tiếng với nhiều loại khác nhau, từ chè khoai tím, chè bắp đến chè sen. Mỗi loại đều có hương vị đặc trưng và cách chế biến riêng.",
    descriptionEn:
      "Hue sweet soups are famous with many different types, from purple sweet potato, corn to lotus seed. Each has its own distinctive flavor and preparation method.",
    image:
      "https://th.bing.com/th/id/OIP.j-7XsxJ5atYdH0ct-FmHugHaEQ?rs=1&pid=ImgDetMain", // Updated image URL
    type: "dessert",
    ingredients: [
      "Đường",
      "Bột năng",
      "Hạt sen",
      "Khoai tím",
      "Bắp",
      "Đậu xanh",
      "Cốt dừa",
    ],
    places: [
      { name: "Chè Hẻm", address: "29/58 Nguyễn Tri Phương, Huế", rating: 4.7 },
      { name: "Chè Sáu Tùng", address: "29 Trần Hưng Đạo, Huế", rating: 4.6 },
    ],
    historicalContext:
      "Chè Huế phản ánh nét tinh tế trong ẩm thực cung đình, với màu sắc hài hòa và hương vị tinh tế.",
    preparation:
      "Mỗi loại chè đều có cách chế biến riêng, nhưng hầu hết đều sử dụng đường, bột năng và các nguyên liệu tự nhiên. Chè Huế thường được phục vụ mát hoặc ấm tùy loại.",
    video: "https://www.youtube.com/watch?v=KJ7Nq3zlYnU",
  },
  {
    id: 6,
    name: "Bánh lọc",
    nameEn: "Tapioca Dumpling",
    description:
      "Bánh lọc là món bánh trong suốt làm từ bột sắn hoặc bột năng, nhân tôm thịt, được gói trong lá chuối và hấp chín.",
    descriptionEn:
      "Banh loc is a transparent cake made from cassava flour or tapioca starch, filled with shrimp and pork, wrapped in banana leaves and steamed.",
    image:
      "https://beptruong.edu.vn/wp-content/uploads/2019/01/banh-bot-loc.jpg", // Updated image URL
    type: "appetizer",
    ingredients: [
      "Bột sắn",
      "Tôm",
      "Thịt heo",
      "Hành tím",
      "Lá chuối",
      "Nước mắm",
      "Ớt",
    ],
    places: [
      { name: "Bánh Huế Huyền", address: "29 Nguyễn Huệ, Huế", rating: 4.6 },
      {
        name: "Bánh lọc Mụ Đợi",
        address: "159 Nguyễn Sinh Cung, Huế",
        rating: 4.7,
      },
    ],
    historicalContext:
      "Bánh lọc xuất phát từ ẩm thực dân gian Huế, thể hiện sự khéo léo của người phụ nữ xứ Huế.",
    preparation:
      "Bột sắn hoặc bột năng được nhào với nước, sau đó nhân tôm thịt được đặt vào giữa, gói kín và hấp chín. Bánh lọc có hai loại: bánh lọc gói và bánh lọc trần.",
    video: "https://www.youtube.com/watch?v=QP_fFZLO4cw",
  },
];

// Component for food cards
const FoodCard = ({ dish }: { dish: (typeof hueDishes)[0] }) => {
  return (
    <Card className="hover-translate overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className="bg-[#B5935A]/90 text-white hover:bg-[#B5935A]"
            >
              {dish.type === "main_dish"
                ? "Món chính"
                : dish.type === "appetizer"
                  ? "Khai vị"
                  : "Tráng miệng"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-[#B5935A] mb-1">{dish.name}</CardTitle>
        <CardDescription className="text-xs mb-2 text-muted-foreground">
          {dish.nameEn}
        </CardDescription>
        <p className="text-sm text-gray-700 line-clamp-3 dark:text-gray-300">
          {dish.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <span className="text-xs text-muted-foreground flex items-center">
          <Utensils className="h-3 w-3 mr-1" />
          {dish.ingredients.length} nguyên liệu
        </span>
        <Button variant="ghost" size="sm" className="text-[#B5935A]">
          Chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
};

// Food detail component
const FoodDetail = ({ dish }: { dish: (typeof hueDishes)[0] }) => {
  return (
    <div className="animate-fade-in">
      <div className="relative h-64 md:h-80 mb-6 overflow-hidden rounded-lg">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-2xl font-bold">{dish.name}</h2>
          <p className="text-sm opacity-90">{dish.nameEn}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-card p-4 rounded-lg mb-6">
            <div className="flex items-center mb-3">
              <Soup className="h-5 w-5 text-[#B5935A] mr-2" />
              <h3 className="text-lg font-medium">Mô tả</h3>
            </div>
            <p className="text-muted-foreground">{dish.description}</p>
          </div>

          <div className="bg-card p-4 rounded-lg mb-6">
            <div className="flex items-center mb-3">
              <History className="h-5 w-5 text-[#B5935A] mr-2" />
              <h3 className="text-lg font-medium">Lịch sử</h3>
            </div>
            <p className="text-muted-foreground">{dish.historicalContext}</p>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <ChefHat className="h-5 w-5 text-[#B5935A] mr-2" />
              <h3 className="text-lg font-medium">Cách chế biến</h3>
            </div>
            <p className="text-muted-foreground">{dish.preparation}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Utensils className="h-5 w-5 text-[#B5935A] mr-2" />
              <h3 className="text-lg font-medium">Nguyên liệu</h3>
            </div>
            <ul className="space-y-1">
              {dish.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="text-muted-foreground text-sm flex items-center"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B5935A] mr-2"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Map className="h-5 w-5 text-[#B5935A] mr-2" />
              <h3 className="text-lg font-medium">Địa điểm nổi tiếng</h3>
            </div>
            {dish.places.map((place, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <p className="font-medium text-sm">{place.name}</p>
                <p className="text-xs text-muted-foreground">{place.address}</p>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < Math.floor(place.rating) ? "text-[#B5935A]" : "text-gray-300 dark:text-gray-600"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs ml-1 text-muted-foreground">
                    {place.rating}/5
                  </span>
                </div>
                {index < dish.places.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}
          </div>

          {dish.video && (
            <div className="bg-card p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Youtube className="h-5 w-5 text-[#B5935A] mr-2" />
                <h3 className="text-lg font-medium">Video hướng dẫn</h3>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(dish.video, "_blank")}
              >
                Xem hướng dẫn
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Culinary map and history section
const CulinaryHistory = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card rounded-lg overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img
            src="https://tapchiamthuc.net/wp-content/uploads/2021/04/doc-dao-net-am-thuc-hue-va-nhung-mon-ngon-kho-cuong-02.jpg" // Updated image URL
            alt="Ẩm thực Huế"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl font-bold">Lịch sử Ẩm thực Huế</h2>
            <p className="text-sm opacity-90">
              Hành trình phát triển của nền ẩm thực tinh tế
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-medium flex items-center mb-3">
              <History className="h-5 w-5 text-[#B5935A] mr-2" />
              Ẩm thực Cung đình Huế
            </h3>
            <p className="text-muted-foreground text-sm">
              Ẩm thực cung đình Huế được hình thành và phát triển qua nhiều
              triều đại của các vua nhà Nguyễn. Đây là nền ẩm thực mang tính
              chất hoàng gia, được chế biến công phu và cầu kỳ bởi các đầu bếp
              cung đình tài năng nhằm phục vụ vua chúa và hoàng tộc.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Đặc trưng của ẩm thực cung đình Huế là sự cân bằng giữa hương - vị
              - sắc - hình, thể hiện triết lý âm dương hài hòa. Mỗi món ăn đều
              được đầu tư về mặt thẩm mỹ, từ cách cắt thái nguyên liệu đến việc
              trình bày đẹp mắt.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Nhiều món ăn ngày nay như bánh bèo, bánh nậm, bánh bột lọc, chè
              Huế... đều có nguồn gốc từ cung đình và sau đó được phổ biến rộng
              rãi trong dân gian.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium flex items-center mb-3">
              <Utensils className="h-5 w-5 text-[#B5935A] mr-2" />
              Ẩm thực Dân gian Huế
            </h3>
            <p className="text-muted-foreground text-sm">
              Song song với ẩm thực cung đình, ẩm thực dân gian Huế cũng phát
              triển với những nét đặc trưng riêng. Đây là nền ẩm thực mộc mạc,
              gần gũi, sử dụng nguyên liệu sẵn có trong tự nhiên và mang đậm bản
              sắc văn hóa địa phương.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Các món ăn dân gian Huế thường đơn giản nhưng không kém phần tinh
              tế, như cơm hến, bún thịt nướng, bánh canh, cháo lươn... Đặc biệt,
              người Huế có xu hướng sử dụng nhiều gia vị cay nồng như ớt, tiêu,
              gừng để tạo nên hương vị đặc trưng.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Sự giao thoa giữa ẩm thực cung đình và dân gian đã tạo nên nền ẩm
              thực Huế phong phú, đa dạng và độc đáo như ngày nay.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium flex items-center mb-3">
              <Coffee className="h-5 w-5 text-[#B5935A] mr-2" />
              Nghệ thuật Thưởng thức
            </h3>
            <p className="text-muted-foreground text-sm">
              Ẩm thực Huế không chỉ dừng lại ở việc chế biến món ăn mà còn là cả
              một nghệ thuật thưởng thức. Người Huế coi trọng không gian, thời
              gian và cách thức thưởng thức ẩm thực.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Nhiều món ăn Huế được thiết kế với kích thước nhỏ nhắn, hương vị
              đậm đà, yêu cầu người ăn phải từ tốn thưởng thức để cảm nhận hết
              hương vị. Đây cũng là phản ánh của tính cách người Huế - nhẹ
              nhàng, tinh tế và sâu sắc.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Ngày nay, ẩm thực Huế không chỉ là niềm tự hào của người dân xứ
              Huế mà còn trở thành một phần quan trọng trong nền ẩm thực Việt
              Nam, thu hút sự quan tâm của du khách trong và ngoài nước.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Culinary map component
const CulinaryMap = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-card rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-medium flex items-center mb-4">
            <Map className="h-5 w-5 text-[#B5935A] mr-2" />
            Bản đồ Ẩm thực Huế
          </h3>

          <div className="relative h-[400px] mb-6 bg-muted rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">Bản đồ đang được tải...</p>
            </div>
            <img
              src="https://example.com/hue-culinary-map.jpg" // Updated image URL
              alt="Bản đồ ẩm thực Huế"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Khu vực nổi tiếng về ẩm thực</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h5 className="font-medium mb-1">Phố cổ Huế</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Khu vực tập trung nhiều quán ăn truyền thống với các món đặc
                  sản Huế.
                </p>
                <Badge variant="outline" className="mr-2 mb-2">
                  Bánh bèo
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Bánh nậm
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Bánh lọc
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Chè Huế
                </Badge>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h5 className="font-medium mb-1">Đường Trần Hưng Đạo</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Con đường với nhiều quán bún bò Huế nổi tiếng.
                </p>
                <Badge variant="outline" className="mr-2 mb-2">
                  Bún bò Huế
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Bánh khoái
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Nem lụi
                </Badge>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h5 className="font-medium mb-1">Chợ Đông Ba</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Khu chợ lớn nhất Huế với nhiều quầy bán đồ ăn truyền thống.
                </p>
                <Badge variant="outline" className="mr-2 mb-2">
                  Bánh ép
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Bún thịt nướng
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Trái cây
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Mè xửng
                </Badge>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h5 className="font-medium mb-1">Sông Hương</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Khu vực ven sông nổi tiếng với các món ăn từ hải sản sông.
                </p>
                <Badge variant="outline" className="mr-2 mb-2">
                  Cơm hến
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Canh cá rô
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Gỏi cá trích
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Xem tour ẩm thực Huế</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CulinaryPage() {
  const [selectedDish, setSelectedDish] = useState<
    (typeof hueDishes)[0] | null
  >(null);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#B5935A]">Ẩm thực Huế</h1>
        <p className="text-muted-foreground mt-2">
          Khám phá tinh hoa ẩm thực xứ Huế với đa dạng hương vị và câu chuyện
          văn hóa đặc sắc
        </p>
      </div>

      <Tabs defaultValue="dishes" className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="dishes" className="gap-2">
            <Soup className="h-4 w-4" />
            <span>Món ăn đặc sản</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            <span>Lịch sử ẩm thực</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2">
            <Map className="h-4 w-4" />
            <span>Bản đồ ẩm thực</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dishes" className="space-y-6">
          {!selectedDish ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hueDishes.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => setSelectedDish(dish)}
                    className="cursor-pointer"
                  >
                    <FoodCard dish={dish} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedDish(null)}
                className="mb-4"
              >
                ← Quay lại danh sách
              </Button>
              <FoodDetail dish={selectedDish} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <CulinaryHistory />
        </TabsContent>

        <TabsContent value="map">
          <CulinaryMap />
        </TabsContent>
      </Tabs>
    </div>
  );
}
